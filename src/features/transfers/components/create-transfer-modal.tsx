import { useState } from 'react';
import { X, DollarSign, MessageSquare, User } from 'lucide-react';
import { useCreateTransferRequest } from '../hooks/useTransfers';
import { useTransferRecipients } from '../hooks/useTransferRecipients';

interface CreateTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export default function CreateTransferModal({ isOpen, onClose, organizationId }: CreateTransferModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    recipientId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: recipientsData, isLoading: isLoadingRecipients } = useTransferRecipients(organizationId);
  const createTransferMutation = useCreateTransferRequest();

  const recipients = recipientsData?.data || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount greater than 0';
      } else if (amount > 1000000) {
        newErrors.amount = 'Amount cannot exceed ₦1,000,000';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Transfer reason is required';
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = 'Reason must be at least 5 characters long';
    }

    if (!formData.recipientId) {
      newErrors.recipientId = 'Please select a recipient';
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
      await createTransferMutation.mutateAsync({
        amount: parseFloat(formData.amount),
        reason: formData.reason.trim(),
        recipientId: formData.recipientId,
        organizationId,
      });
      
      // Reset form and close modal
      setFormData({
        amount: '',
        reason: '',
        recipientId: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create transfer request:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return numericValue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-border w-96 shadow-lg rounded-md bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-card-foreground">Create Transfer Request</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Selection */}
          <div>
            <label htmlFor="recipientId" className="block text-sm font-medium text-foreground mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Transfer Recipient
            </label>
            <select
              id="recipientId"
              value={formData.recipientId}
              onChange={(e) => handleInputChange('recipientId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                errors.recipientId ? 'border-red-500' : 'border-input'
              }`}
              disabled={isLoadingRecipients}
            >
              <option value="">Select a recipient</option>
              {recipients.filter(r => r.isActive).map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name} - {recipient.bankName} ({recipient.accountNumber})
                </option>
              ))}
            </select>
            {errors.recipientId && <p className="mt-1 text-sm text-red-500">{errors.recipientId}</p>}
            {isLoadingRecipients && <p className="mt-1 text-sm text-muted-foreground">Loading recipients...</p>}
            {!isLoadingRecipients && recipients.filter(r => r.isActive).length === 0 && (
              <p className="mt-1 text-sm text-yellow-500">No active recipients found. Please add a recipient first.</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Amount (₦)
            </label>
            <input
              type="text"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', formatAmount(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                errors.amount ? 'border-red-500' : 'border-input'
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
            {formData.amount && !errors.amount && (
              <p className="mt-1 text-sm text-muted-foreground">
                Amount: ₦{parseFloat(formData.amount || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-foreground mb-1">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              Transfer Reason
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground ${
                errors.reason ? 'border-red-500' : 'border-input'
              }`}
              placeholder="Enter the reason for this transfer..."
            />
            {errors.reason && <p className="mt-1 text-sm text-red-500">{errors.reason}</p>}
            <p className="mt-1 text-sm text-muted-foreground">
              {formData.reason.length}/200 characters
            </p>
          </div>

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
              disabled={createTransferMutation.isPending || recipients.filter(r => r.isActive).length === 0}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 rounded-md transition-colors"
            >
              {createTransferMutation.isPending ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
