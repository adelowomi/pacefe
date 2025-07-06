import { useState, useMemo, useCallback } from 'react';
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
  Square,
  Receipt,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Download,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useTransferRequests, useApproveTransferRequest, useRejectTransferRequest, type TransferRequestFilters } from '../hooks/useTransfers';
import CreateTransferModal from './create-transfer-modal';
import TransferReceiptModal from './transfer-receipt-modal';
import ConfirmationModal from '../../../components/ui/confirmation-modal';
import type { TransferRequestView } from '../../../api/models/TransferRequestView';

interface TransferRequestsEnhancedProps {
  organizationId: string;
}

type TabType = 'all' | 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';
type SortField = 'amount' | 'dateCreated' | 'status' | 'requester';

export default function TransferRequestsEnhanced({ organizationId }: TransferRequestsEnhancedProps) {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<string | null>(null);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTransferForReceipt, setSelectedTransferForReceipt] = useState<TransferRequestView | null>(null);
  
  // Filter and pagination states
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<SortField>('dateCreated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Advanced filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const [selectedRequesterId, setSelectedRequesterId] = useState('');
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');
  const [appliedMinAmount, setAppliedMinAmount] = useState<number | undefined>();
  const [appliedMaxAmount, setAppliedMaxAmount] = useState<number | undefined>();
  const [appliedRequesterId, setAppliedRequesterId] = useState('');

  // Build filters object
  const filters: TransferRequestFilters = useMemo(() => ({
    pageNumber: currentPage,
    pageSize,
    statuses: activeTab === 'all' ? undefined : activeTab,
    searchTerm: appliedSearchTerm.trim() || undefined,
    dateFrom: appliedDateFrom || undefined,
    dateTo: appliedDateTo || undefined,
    minAmount: appliedMinAmount,
    maxAmount: appliedMaxAmount,
    requesterId: appliedRequesterId || undefined,
    sortBy: sortField,
    sortOrder,
  }), [currentPage, pageSize, activeTab, appliedSearchTerm, appliedDateFrom, appliedDateTo, appliedMinAmount, appliedMaxAmount, appliedRequesterId, sortField, sortOrder]);

  const { data: requestsResponse, isLoading, isFetching, refetch } = useTransferRequests(organizationId, filters);
  const approveRequestMutation = useApproveTransferRequest();
  const rejectRequestMutation = useRejectTransferRequest();

  const requests = requestsResponse?.data?.items || [];
  const metadata = requestsResponse?.data?.metadata;

  // Calculate totals for current page
  const currentPageStats = useMemo(() => {
    const totalAmount = requests.reduce((sum, r) => sum + (r.amount || 0), 0);
    const pendingRequests = requests.filter(r => r.status?.toLowerCase() === 'pending');
    const pendingAmount = pendingRequests.reduce((sum, r) => sum + (r.amount || 0), 0);
    
    return {
      totalRequests: requests.length,
      totalAmount,
      pendingRequests: pendingRequests.length,
      pendingAmount,
    };
  }, [requests]);

  // Selected requests calculations
  const selectedTotalAmount = useMemo(() => {
    return requests
      .filter(r => r.id && selectedRequests.has(r.id) && r.status?.toLowerCase() === 'pending')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  }, [requests, selectedRequests]);

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

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedRequests(new Set());
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedSearchTerm(searchTerm);
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    setAppliedMinAmount(minAmount);
    setAppliedMaxAmount(maxAmount);
    setAppliedRequesterId(selectedRequesterId);
    setCurrentPage(1);
  }, [searchTerm, dateFrom, dateTo, minAmount, maxAmount, selectedRequesterId]);

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  }, [applyFilters]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  }, [sortField, sortOrder]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedRequests(new Set());
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setMinAmount(undefined);
    setMaxAmount(undefined);
    setSelectedRequesterId('');
    setAppliedSearchTerm('');
    setAppliedDateFrom('');
    setAppliedDateTo('');
    setAppliedMinAmount(undefined);
    setAppliedMaxAmount(undefined);
    setAppliedRequesterId('');
    setCurrentPage(1);
  }, []);

  // Action handlers
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

  const openReceiptModal = (transfer: TransferRequestView) => {
    setSelectedTransferForReceipt(transfer);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedTransferForReceipt(null);
  };

  const canGenerateReceipt = (status?: string) => {
    const eligibleStatuses = ['approved', 'processed'];
    return eligibleStatuses.includes(status?.toLowerCase() || '');
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
    const pendingRequests = requests.filter(r => r.status?.toLowerCase() === 'pending');
    if (selectedRequests.size === pendingRequests.length) {
      setSelectedRequests(new Set());
    } else {
      const allPendingIds = new Set(
        pendingRequests.map(r => r.id).filter(Boolean) as string[]
      );
      setSelectedRequests(allPendingIds);
    }
  };

  const handleBulkApprove = async () => {
    const requestIds = Array.from(selectedRequests);
    
    try {
      await Promise.all(
        requestIds.map(id => approveRequestMutation.mutateAsync(id))
      );
      
      setShowBulkApproveModal(false);
      setSelectedRequests(new Set());
    } catch (error) {
      console.error('Failed to bulk approve requests:', error);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-primary" /> : 
      <ArrowDown className="h-4 w-4 text-primary" />;
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
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-foreground">Transfer Requests</h3>
          <p className="text-sm text-muted-foreground">
            Manage and track your organization's transfer requests with advanced filtering and pagination
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center px-3 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by recipient name, reference, or reason... (Press Enter to search)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={applyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 border border-input rounded-md shadow-sm text-sm font-medium ${
              showFilters ? 'bg-accent text-accent-foreground' : 'text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Min Amount (₦)</label>
                <input
                  type="number"
                  value={minAmount || ''}
                  onChange={(e) => setMinAmount(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Max Amount (₦)</label>
                <input
                  type="number"
                  value={maxAmount || ''}
                  onChange={(e) => setMaxAmount(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent"
                  placeholder="No limit"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={applyFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
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
              onClick={() => handleTabChange(key)}
              className={`${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpRight className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">
                Current Page
              </p>
              <p className="text-lg font-bold text-card-foreground">{currentPageStats.totalRequests}</p>
              <p className="text-xs text-muted-foreground">of {metadata?.totalCount || 0} total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground">Page Total</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                ₦{currentPageStats.totalAmount.toLocaleString('en-NG')}
              </p>
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
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{currentPageStats.pendingRequests}</p>
            </div>
          </div>
        </div>
        
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
      </div>

      {/* Bulk Actions */}
      {activeTab === 'pending' && currentPageStats.pendingRequests > 0 && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {selectedRequests.size === requests.filter(r => r.status?.toLowerCase() === 'pending').length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>
                {selectedRequests.size === requests.filter(r => r.status?.toLowerCase() === 'pending').length ? 'Deselect All' : 'Select All'}
              </span>
            </button>
            {selectedRequests.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedRequests.size} selected • ₦{selectedTotalAmount.toLocaleString('en-NG')}
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
      {requests.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <ArrowUpRight className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-card-foreground">No transfer requests found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {appliedSearchTerm || appliedDateFrom || appliedDateTo || appliedMinAmount || appliedMaxAmount ? 
              'Try adjusting your search criteria or filters.' :
              'Get started by creating your first transfer request.'
            }
          </p>
          <div className="mt-6 space-x-3">
            {(appliedSearchTerm || appliedDateFrom || appliedDateTo || appliedMinAmount || appliedMaxAmount) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Clear Filters
              </button>
            )}
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
        <div className="space-y-4">
          {/* Sort Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <button
                onClick={() => handleSort('dateCreated')}
                className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
              >
                <span>Date</span>
                {getSortIcon('dateCreated')}
              </button>
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
              >
                <span>Amount</span>
                {getSortIcon('amount')}
              </button>
              <button
                onClick={() => handleSort('status')}
                className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
              >
                <span>Status</span>
                {getSortIcon('status')}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-input rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-ring focus:border-transparent text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-card shadow overflow-hidden sm:rounded-md border border-border">
            <ul className="divide-y divide-border">
              {requests.map((request) => (
                <li key={request.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Selection checkbox for pending requests */}
                      {request.status?.toLowerCase() === 'pending' && request.id && (
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
                    <div className="flex items-center space-x-2">
                      {/* Receipt button for successful transfers */}
                      {canGenerateReceipt(request.status) && (
                        <button
                          onClick={() => openReceiptModal(request)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="Generate receipt"
                        >
                          <Receipt className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* Pending request actions */}
                      {request.status?.toLowerCase() === 'pending' && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {metadata && metadata.totalPages && metadata.totalPages > 1 && (
            <div className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                  Showing {((metadata.currentPage - 1) * metadata.pageSize) + 1} to{' '}
                  {Math.min(metadata.currentPage * metadata.pageSize, metadata.totalCount)} of{' '}
                  {metadata.totalCount} results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!metadata.hasPrevious || isFetching}
                  className="inline-flex items-center px-3 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, metadata.totalPages || 0) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(
                      (metadata.totalPages || 0) - 4,
                      Math.max(1, currentPage - 2)
                    )) + i;
                    
                    if (pageNum > (metadata.totalPages || 0)) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isFetching}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNum === currentPage
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        } disabled:opacity-50`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!metadata.hasNext || isFetching}
                  className="inline-flex items-center px-3 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
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

      {/* Transfer Receipt Modal */}
      {selectedTransferForReceipt && (
        <TransferReceiptModal
          isOpen={showReceiptModal}
          onClose={closeReceiptModal}
          transfer={selectedTransferForReceipt}
          organizationName="Your Organization" // TODO: Get actual organization name
        />
      )}
    </div>
  );
}
