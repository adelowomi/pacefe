import { useState } from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useTransferRequests, useApproveTransferRequest, useRejectTransferRequest } from '../hooks/useTransfers';
import CreateTransferModal from './create-transfer-modal';
import ConfirmationModal from '../../../components/ui/confirmation-modal';

interface TransferRequestsProps {
  organizationId: string;
}

export default function TransferRequests({ organizationId }: TransferRequestsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useTransferRequests(organizationId);
  const approveRequestMutation = useApproveTransferRequest();
  const rejectRequestMutation = useRejectTransferRequest();

  const requests = requestsData?.data || [];

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'processed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const openApproveModal = (requestId: string) => {
    setRequestToApprove(requestId);
    setShowApproveModal(true);
  };

  const handleApproveRequest = async () => {
    if (!requestToApprove) return;

    try {
      await approveRequestMutation.mutateAsync(requestToApprove);
      setShowApproveModal(false);
      setRequestToApprove(null);
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;

    try {
      await rejectRequestMutation.mutateAsync({
        requestId: selectedRequest,
        reason: rejectReason.trim()
      });
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const openRejectModal = (requestId: string) => {
    setSelectedRequest(requestId);
    setShowRejectModal(true);
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
          <h3 className="text-lg font-medium text-foreground">Transfer Requests</h3>
          <p className="text-sm text-muted-foreground">
            Manage and track your organization's transfer requests
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Request
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpRight className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
              <p className="text-lg font-bold text-card-foreground">{requests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {requests.filter(r => r.status?.toLowerCase() === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {requests.filter(r => ['approved', 'processed'].includes(r.status?.toLowerCase() || '')).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                ₦{requests.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-NG')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <ArrowUpRight className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-card-foreground">No transfer requests</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first transfer request.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card shadow overflow-hidden sm:rounded-md border border-border">
          <ul className="divide-y divide-border">
            {requests.map((request) => (
              <li key={request.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-card-foreground">
                          ₦{request.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status || '')}`}>
                          {getStatusIcon(request.status || '')}
                          <span className="ml-1">{request.status}</span>
                        </span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-card-foreground">
                          To: <span className="font-medium">{request.recipient?.name}</span>
                          {request.recipient?.bankName && (
                            <span className="text-muted-foreground"> - {request.recipient.bankName}</span>
                          )}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {request.requester?.firstName} {request.requester?.lastName}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {request.dateCreated && new Date(request.dateCreated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        {request.reference && (
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            Ref: {request.reference}
                          </div>
                        )}
                      </div>
                      {request.reason && (
                        <div className="mt-2 flex items-start">
                          <MessageSquare className="h-3 w-3 mr-1 mt-0.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{request.reason}</p>
                        </div>
                      )}
                      {request.failureReason && (
                        <div className="mt-2 flex items-start">
                          <AlertCircle className="h-3 w-3 mr-1 mt-0.5 text-red-400" />
                          <p className="text-xs text-red-600 dark:text-red-400">Failed: {request.failureReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {request.status?.toLowerCase() === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => request.id && openApproveModal(request.id)}
                        disabled={approveRequestMutation.isPending}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 disabled:opacity-50"
                        title="Approve request"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => request.id && openRejectModal(request.id)}
                        disabled={rejectRequestMutation.isPending}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 disabled:opacity-50"
                        title="Reject request"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create Transfer Modal */}
      <CreateTransferModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        organizationId={organizationId}
      />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-border w-96 shadow-lg rounded-md bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-card-foreground">Reject Transfer Request</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectReason('');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="rejectReason" className="block text-sm font-medium text-foreground mb-1">
                  Reason for rejection
                </label>
                <textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                  placeholder="Please provide a reason for rejecting this request..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRequest(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectRequest}
                  disabled={!rejectReason.trim() || rejectRequestMutation.isPending}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejectRequestMutation.isPending ? 'Rejecting...' : 'Reject Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setRequestToApprove(null);
        }}
        onConfirm={handleApproveRequest}
        title="Approve Transfer Request"
        message="Are you sure you want to approve this transfer request? This action will process the transfer and cannot be undone."
        confirmText="Approve Request"
        cancelText="Cancel"
        type="success"
        isLoading={approveRequestMutation.isPending}
      />
    </div>
  );
}
