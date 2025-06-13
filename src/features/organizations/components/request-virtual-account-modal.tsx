import { useState } from 'react';
import { X, CreditCard, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRequestVirtualAccount } from '../hooks/useVirtualAccount';
import { useUserProfile } from '../../users/hooks/useUser';

interface RequestVirtualAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationName: string;
}

export default function RequestVirtualAccountModal({
  isOpen,
  onClose,
  organizationId,
  organizationName,
}: RequestVirtualAccountModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { data: userProfileData } = useUserProfile();
  const requestVirtualAccountMutation = useRequestVirtualAccount();

  const userProfile = userProfileData?.data;
  const hasPhoneNumber = userProfile?.phoneNumber && userProfile.phoneNumber.trim() !== '';

  const handleRequest = async () => {
    if (!hasPhoneNumber) {
      return;
    }

    try {
      await requestVirtualAccountMutation.mutateAsync(organizationId);
      onClose();
      setIsConfirming(false);
    } catch (error) {
      console.error('Failed to request virtual account:', error);
    }
  };

  const handleClose = () => {
    if (!requestVirtualAccountMutation.isPending) {
      onClose();
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Request Virtual Account
          </h3>
          <button
            onClick={handleClose}
            disabled={requestVirtualAccountMutation.isPending}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!hasPhoneNumber ? (
            // Phone number required message
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Phone Number Required
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    You must add a phone number to your profile before requesting a virtual account for your organization.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-card-foreground">
                  Why do we need your phone number?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Security verification for financial transactions
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Account recovery and important notifications
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Compliance with financial regulations
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Navigate to profile page to add phone number
                    window.location.href = '/users';
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Add Phone Number
                </button>
              </div>
            </div>
          ) : !isConfirming ? (
            // Initial request screen
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Ready to Request Virtual Account
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Your profile has a verified phone number. You can now request a virtual account.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-card-foreground">
                  Organization Details
                </h4>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-card-foreground font-medium">{organizationName}</p>
                  <p className="text-xs text-muted-foreground mt-1">Organization ID: {organizationId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-card-foreground">
                  Contact Information
                </h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{userProfile.phoneNumber}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-card-foreground">
                  What happens next?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Your request will be processed by our team
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    You'll receive a confirmation via email and SMS
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Virtual account details will be available once approved
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsConfirming(true)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            // Confirmation screen
            <div className="space-y-4">
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-medium text-card-foreground mb-2">
                  Confirm Virtual Account Request
                </h4>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to request a dedicated virtual account for <strong>{organizationName}</strong>?
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Organization:</span>
                  <span className="text-card-foreground font-medium">{organizationName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contact Phone:</span>
                  <span className="text-card-foreground font-medium">{userProfile.phoneNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Request Date:</span>
                  <span className="text-card-foreground font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsConfirming(false)}
                  disabled={requestVirtualAccountMutation.isPending}
                  className="flex-1 px-4 py-2 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleRequest}
                  disabled={requestVirtualAccountMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {requestVirtualAccountMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Requesting...
                    </div>
                  ) : (
                    'Confirm Request'
                  )}
                </button>
              </div>
            </div>
          )}

          {requestVirtualAccountMutation.error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                Failed to request virtual account. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
