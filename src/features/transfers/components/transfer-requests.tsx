import { useState, useMemo } from 'react';
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
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { useTransferRequests, useApproveTransferRequest, useRejectTransferRequest } from '../hooks/useTransfers';
import CreateTransferModal from './create-transfer-modal';
import ConfirmationModal from '../../../components/ui/confirmation-modal';
import type { TransferRequestView } from '../../../api/models/TransferRequestView';

interface TransferRequestsProps {
  organizationId: string;
}

type TabType = 'all' | 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';

export default function TransferRequests({ organizationId }: TransferRequestsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);

  const { data: requestsData, isLoading } = useTransferRequests(organizationId);
  const approveRequestMutation = useApproveTransferRequest();
  const rejectRequestMutation = useRejectTransferRequest();

  const requests = requestsData?.data || [];

  // Group requests by status
  const groupedRequests = useMemo(() => {
    const groups = {
      all: requests,
      pending: requests.filter(r => r.status?.toLowerCase() === 'pending'),
      approved: requests.filter(r => r.status?.toLowerCase() === 'approved'),
      rejected: requests.filter(r => r.status?.toLowerCase() === 'rejected'),
      processed: requests.filter(r => r.status?.toLowerCase() === 'processed'),
      failed: requests.filter(r => r.status?.toLowerCase() === 'failed'),
    };
    return groups;
  }, [requests]);

  const currentRequests = groupedRequests[activeTab];

  // Calculate total amount for pending requests
  const pendingTotalAmount = useMemo(() => {
    return groupedRequests.pending.reduce((sum, r) => sum + (r.amount || 0), 0);
  }, [groupedRequests.pending]);

  // Calculate selected requests total amount
  const selectedTotalAmount = useMemo(() => {
    return groupedRequests.pending
      .filter(r => r.id && selectedRequests.has(r.id))
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  }, [groupedRequests.pending, selectedRequests]);

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

  // Bulk selection handlers
  const toggleRequestSelection = (requestId: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    setSelectedRequests(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRequests.size === groupedRequests.pending.length) {
      setSelectedRequests(new Set());
    } else {
      const allPendingIds = new Set(
        groupedRequests.pending.map(r => r.id).filter(Boolean) as string[]
      );
      setSelectedRequests(allPendingIds);
    }
  };

  const handleBulkApprove = async () => {
    const requestIds = Array.from(selectedRequests);
    
    try {
      // Approve all selected requests
      await Promise.all(
        requestIds.map(id => approveRequestMutation.mutateAsync(id))
      );
      
      setShowBulkApproveModal(false);
      setSelectedRequests(new Set());
    } catch (error) {
      console.error('Failed to bulk approve requests:', error);
    }
  };

  const getTabCount = (tab: TabType) => {
    return groupedRequests[tab].length;
  };

  const getTabColor = (tab: TabType) => {
    switch (tab) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      case 'processed':
        return 'text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
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

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all' as TabType, label: 'All Requests', icon: ArrowUpRight },
            { key: 'pending' as TabType, label: 'Pending', icon: Clock },
            { key: 'approved' as TabType, label: 'Approved', icon: CheckCircle },
            { key: 'processed' as TabType, label: 'Processed', icon: CheckCircle },
            { key: 'rejected' as TabType, label: 'Rejected', icon: XCircle },
            { key: 'failed' as TabType, label: 'Failed', icon: AlertCircle },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSelectedRequests(new Set()); // Clear selections when switching tabs
              }}
              className={`${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${getTabColor(key)} bg-current/10`}>
                {getTabCount(key)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Summary Stats for Current Tab */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpRight className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">
                {activeTab === 'all' ? 'Total Requests' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests`}
              </p>
              <p className="text-lg font-bold text-card-foreground">{currentRequests.length}</p>
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
                ₦{currentRequests.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-NG')}
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'pending' && (
          <>
            <div className="bg-card rounded-lg shadow-sm border border-border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-muted-foreground">Selected</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedRequests.size}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm border border-border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-muted-foreground">Selected Amount</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ₦{selectedTotalAmount.toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Actions for Pending Tab */}
      {activeTab === 'pending' && groupedRequests.pending.length > 0 && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {selectedRequests.size === groupedRequests.pending.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>
                {selectedRequests.size === groupedRequests.pending.length ? 'Deselect All' : 'Select All'}
              </span>
            </button>
            {selectedRequests.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedRequests.size} of {groupedRequests.pending.length} selected
              </span>
            )}
          </div>
          
          {selectedRequests.size > 0 && (
            <button
              onClick={() => setShowBulkApproveModal(true)}
              disabled={approveRequestMutation.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve Selected ({selectedRequests.size})
            </button>
          )}
        </div>
      )}

      {/* Requests List */}
      {currentRequests.length === 0 ? (
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
            {currentRequests.map((request) => (
              <li key={request.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Selection checkbox for pending requests */}
                    {activeTab === 'pending' && request.id && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => toggleRequestSelection(request.id!)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {selectedRequests.has(request.id) ? (
                            <CheckSquare className="h-5 w-5 text-primary" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    )}
                    
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
                  {request.status?.toLowerCase() === 'pending' && activeTab !== 'pending' && (
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
                  
                  {/* Individual action buttons for pending tab */}
                  {request.status?.toLowerCase() === 'pending' && activeTab === 'pending' && (
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

      {/* Bulk Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkApproveModal}
        onClose={() => setShowBulkApproveModal(false)}
        onConfirm={handleBulkApprove}
        title="Bulk Approve Transfer Requests"
        message={`Are you sure you want to approve ${selectedRequests.size} transfer requests with a total amount of ₦${selectedTotalAmount.toLocaleString('en-NG')}? This action will process all selected transfers and cannot be undone.`}
        confirmText={`Approve ${selectedRequests.size} Requests`}
        cancelText="Cancel"
        type="success"
        isLoading={approveRequestMutation.isPending}
      />
    </div>
  );
}
