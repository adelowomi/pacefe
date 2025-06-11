import { useState } from 'react';
import { X, Mail, Key } from 'lucide-react';
import { useInitiatePasswordReset } from '../hooks/useUser';
import type { InitiatePasswordResetModel } from '@/api/models/InitiatePasswordResetModel';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const initiatePasswordResetMutation = useInitiatePasswordReset();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const resetData: InitiatePasswordResetModel = { email };
      await initiatePasswordResetMutation.mutateAsync(resetData);
      
      setIsSuccess(true);
      setErrors({});
    } catch (error: any) {
      console.error('Failed to initiate password reset:', error);
      
      // Handle specific error messages from the API
      if (error?.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error?.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Failed to send password reset email. Please try again.' });
      }
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setEmail('');
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal panel */}
      <div className="relative bg-card border border-border rounded-lg shadow-xl max-w-md w-full">
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 sm:mx-0 sm:h-10 sm:w-10">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-card-foreground">
                      Forgot Password
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your email to receive a password reset link
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                      errors.email ? 'border-red-500' : 'border-input'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
                    {errors.submit}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={initiatePasswordResetMutation.isPending}
                className="w-full inline-flex justify-center rounded-md px-4 py-2 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                {initiatePasswordResetMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={initiatePasswordResetMutation.isPending}
                className="mt-3 w-full inline-flex justify-center rounded-md px-4 py-2 text-base font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="bg-card px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 sm:mx-0 sm:h-10 sm:w-10">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-card-foreground">
                    Email Sent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox for the reset link
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your email and follow the instructions to reset your password.
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
