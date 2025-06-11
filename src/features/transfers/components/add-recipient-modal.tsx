import { useState } from 'react';
import { X, User, Mail, CreditCard, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateTransferRecipient, useBanks, useVerifyAccount } from '../hooks/useTransferRecipients';

interface AddRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export default function AddRecipientModal({ isOpen, onClose, organizationId }: AddRecipientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountNumber: '',
    bankCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationStatus, setVerificationStatus] = useState<{
    status: 'idle' | 'verifying' | 'verified' | 'failed';
    accountName?: string;
    message?: string;
  }>({ status: 'idle' });

  const { data: banksData, isLoading: isLoadingBanks } = useBanks();
  const createRecipientMutation = useCreateTransferRecipient();
  const verifyAccountMutation = useVerifyAccount();

  const banks = banksData?.data || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Recipient name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be exactly 10 digits';
    }

    if (!formData.bankCode) {
      newErrors.bankCode = 'Please select a bank';
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
      await createRecipientMutation.mutateAsync({
        ...formData,
        organizationId,
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        accountNumber: '',
        bankCode: '',
      });
      setErrors({});
      setVerificationStatus({ status: 'idle' });
      onClose();
    } catch (error) {
      console.error('Failed to create recipient:', error);
    }
  };


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Reset verification status when account number or bank changes
    if (field === 'accountNumber' || field === 'bankCode') {
      setVerificationStatus({ status: 'idle' });
    }
  };

  const handleVerifyAccount = async () => {
    if (!formData.accountNumber || !formData.bankCode) {
      setErrors(prev => ({
        ...prev,
        accountNumber: !formData.accountNumber ? 'Account number is required' : '',
        bankCode: !formData.bankCode ? 'Please select a bank' : '',
      }));
      return;
    }

    if (!/^\d{10}$/.test(formData.accountNumber)) {
      setErrors(prev => ({
        ...prev,
        accountNumber: 'Account number must be exactly 10 digits',
      }));
      return;
    }

    setVerificationStatus({ status: 'verifying' });

    try {
      const response = await verifyAccountMutation.mutateAsync({
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
      });

      if (response.success && response.data) {
        // Extract account name from the nested response structure
        // Based on the API response: data.data.account_name
        const accountName = (response.data as any)?.data?.account_name || 
                           (response.data as any)?.data?.accountName ||
                           (response.data as any)?.account_name || 
                           (response.data as any)?.accountName;
        
        setVerificationStatus({
          status: 'verified',
          accountName: accountName,
          message: 'Account verified successfully',
        });

        // Auto-fill the name if it's empty and we got an account name
        if (!formData.name && accountName) {
          setFormData(prev => ({ ...prev, name: accountName }));
        }
      } else {
        setVerificationStatus({
          status: 'failed',
          message: response.message || 'Account verification failed',
        });
      }
    } catch (error: any) {
      setVerificationStatus({
        status: 'failed',
        message: error?.message || 'Failed to verify account. Please try again.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-border w-96 shadow-lg rounded-md bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-card-foreground">Add Transfer Recipient</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Recipient Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                errors.name ? 'border-red-500' : 'border-input'
              }`}
              placeholder="Enter recipient's full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                errors.email ? 'border-red-500' : 'border-input'
              }`}
              placeholder="recipient@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Account Number */}
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-foreground mb-1">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                errors.accountNumber ? 'border-red-500' : 'border-input'
              }`}
              placeholder="1234567890"
              maxLength={10}
            />
            {errors.accountNumber && <p className="mt-1 text-sm text-red-500">{errors.accountNumber}</p>}
          </div>

          {/* Bank Selection */}
          <div>
            <label htmlFor="bankCode" className="block text-sm font-medium text-foreground mb-1">
              <Building2 className="h-4 w-4 inline mr-1" />
              Bank
            </label>
            <select
              id="bankCode"
              value={formData.bankCode}
              onChange={(e) => handleInputChange('bankCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.bankCode ? 'border-red-500' : 'border-input'
              }`}
              disabled={isLoadingBanks}
            >
              <option value="">Select a bank</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankCode && <p className="mt-1 text-sm text-red-500">{errors.bankCode}</p>}
            {isLoadingBanks && <p className="mt-1 text-sm text-muted-foreground">Loading banks...</p>}
          </div>

          {/* Account Verification */}
          {formData.accountNumber && formData.bankCode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Account Verification</span>
                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  disabled={verificationStatus.status === 'verifying'}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {verificationStatus.status === 'verifying' ? 'Verifying...' : 'Verify Account'}
                </button>
              </div>

              {/* Verification Status */}
              {verificationStatus.status === 'verified' && (
                <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Account Verified</p>
                    {verificationStatus.accountName && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Account Name: {verificationStatus.accountName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {verificationStatus.status === 'failed' && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Verification Failed</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {verificationStatus.message || 'Unable to verify account details'}
                    </p>
                  </div>
                </div>
              )}

              {verificationStatus.status === 'verifying' && (
                <div className="flex items-center space-x-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-sm text-primary">Verifying account details...</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRecipientMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 rounded-md transition-colors"
            >
              {createRecipientMutation.isPending ? 'Adding...' : 'Add Recipient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
