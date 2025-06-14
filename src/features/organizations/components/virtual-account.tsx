import { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  Copy, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useVirtualAccount, useVirtualAccountTransactions } from '../hooks/useVirtualAccount';
import type { VirtualAccountView } from '../../../api/models/VirtualAccountView';
import type { VirtualAccountTransactionView } from '../../../api/models/VirtualAccountTransactionView';

interface VirtualAccountProps {
  organizationId: string;
  organizationName: string;
}

export default function VirtualAccount({ organizationId, organizationName }: VirtualAccountProps) {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const { 
    data: virtualAccountData, 
    isLoading: isLoadingAccount, 
    error: accountError,
    refetch: refetchAccount 
  } = useVirtualAccount(organizationId);

  const { 
    data: transactionsData, 
    isLoading: isLoadingTransactions, 
    error: transactionsError,
    refetch: refetchTransactions 
  } = useVirtualAccountTransactions({
    organizationId,
    pageNumber: currentPage,
    pageSize,
    searchTerm: searchTerm || undefined,
    sortBy,
    sortOrder,
  });

  const virtualAccount = virtualAccountData?.data;
  const transactions = transactionsData?.data?.items || [];
  const pagination = transactionsData?.data?.metadata;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  const formatCurrency = (amount: number, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'successful':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'failed':
      case 'failure':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };

  const handleRefresh = () => {
    refetchAccount();
    refetchTransactions();
  };

  if (isLoadingAccount) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (accountError || !virtualAccount) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">Virtual Account Not Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This organization doesn't have a virtual account yet or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Virtual Account Details */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Virtual Account Details
          </h3>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-1.5 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Account Number</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-sm">
                  {showAccountNumber ? virtualAccount.accountNumber : '••••••••••'}
                </div>
                <button
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(virtualAccount.accountNumber || '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Account Name</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm">
                  {virtualAccount.accountName}
                </div>
                <button
                  onClick={() => copyToClipboard(virtualAccount.accountName || '')}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Bank</label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                {virtualAccount.bankName}
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Currency</label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                {virtualAccount.currency}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  virtualAccount.isActive 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {virtualAccount.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                {virtualAccount.dateCreated ? formatDate(virtualAccount.dateCreated) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Transaction History
            </h3>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="transactionDate-desc">Date (Newest)</option>
              <option value="transactionDate-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : transactionsError ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Failed to load transactions</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={transaction.reference || index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ArrowDownLeft className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-card-foreground">
                          {transaction.narration || 'Transaction'}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status || '')}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>Ref: {transaction.reference}</span>
                        <span>•</span>
                        <span>{transaction.channel}</span>
                        {transaction.senderName && (
                          <>
                            <span>•</span>
                            <span>From: {transaction.senderName}</span>
                          </>
                        )}
                      </div>
                      {transaction.transactionDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {formatDate(transaction.transactionDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      +{formatCurrency(transaction.amount || 0, transaction.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of{' '}
                {pagination.totalCount} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages || 1, currentPage + 1))}
                  disabled={currentPage >= (pagination.totalPages || 1)}
                  className="px-3 py-1 border border-input rounded-md text-sm font-medium text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
