import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Mail, 
  CreditCard, 
  Building2, 
  Trash2, 
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTransferRecipients, useDeleteTransferRecipient } from '../hooks/useTransferRecipients';
import AddRecipientModal from './add-recipient-modal';
import ConfirmationModal from '../../../components/ui/confirmation-modal';

interface TransferRecipientsProps {
  organizationId: string;
}

export default function TransferRecipients({ organizationId }: TransferRecipientsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: recipientsData, isLoading } = useTransferRecipients(organizationId);
  const deleteRecipientMutation = useDeleteTransferRecipient();

  const recipients = recipientsData?.data || [];

  const openDeleteModal = (recipientId: string, recipientName: string) => {
    setRecipientToDelete({ id: recipientId, name: recipientName });
    setShowDeleteModal(true);
  };

  const handleDeleteRecipient = async () => {
    if (!recipientToDelete) return;

    try {
      await deleteRecipientMutation.mutateAsync(recipientToDelete.id);
      setShowDeleteModal(false);
      setRecipientToDelete(null);
    } catch (error) {
      console.error('Failed to delete recipient:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-foreground">Transfer Recipients</h3>
          <p className="text-sm text-muted-foreground">
            Manage recipients for your organization's transfers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recipient
        </button>
      </div>

      {/* Recipients List */}
      {recipients.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-card-foreground">No recipients</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by adding your first transfer recipient.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card shadow overflow-hidden sm:rounded-md border border-border">
          <ul className="divide-y divide-border">
            {recipients.map((recipient) => (
              <li key={recipient.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {recipient.name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          recipient.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {recipient.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {recipient.email}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" />
                          {recipient.accountNumber}
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {recipient.bankName}
                        </div>
                      </div>
                      {recipient.dateCreated && (
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Added {new Date(recipient.dateCreated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => recipient.id && recipient.name && openDeleteModal(recipient.id, recipient.name)}
                      disabled={deleteRecipientMutation.isPending}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 disabled:opacity-50"
                      title="Delete recipient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      {recipients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Total Recipients</p>
                <p className="text-lg font-bold text-card-foreground">{recipients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Active Recipients</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {recipients.filter(r => r.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Unique Banks</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {new Set(recipients.map(r => r.bankCode)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipient Modal */}
      <AddRecipientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        organizationId={organizationId}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRecipientToDelete(null);
        }}
        onConfirm={handleDeleteRecipient}
        title="Delete Recipient"
        message={`Are you sure you want to delete ${recipientToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Recipient"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteRecipientMutation.isPending}
      />
    </div>
  );
}
