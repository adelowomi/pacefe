import React from 'react';
import { Download, CheckCircle, Calendar, User, Building, CreditCard, Hash, FileText } from 'lucide-react';
import type { TransferRequestView } from '../../../api/models/TransferRequestView';

interface TransferReceiptProps {
  transfer: TransferRequestView;
  onDownload: () => void;
  organizationName?: string;
}

export default function TransferReceipt({ transfer, onDownload, organizationName }: TransferReceiptProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '₦0.00';
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'processed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'approved':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transfer Receipt</h1>
            <p className="text-blue-100 mt-1">Payment Confirmation</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <CheckCircle className="h-8 w-8 text-green-300 mr-2" />
              <span className="text-lg font-semibold">Completed</span>
            </div>
            <button
              onClick={onDownload}
              className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors print:hidden"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="px-6 py-8">
        {/* Transaction Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Transaction Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium text-gray-900">{transfer.reference || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date Processed</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(transfer.processedDate || transfer.approvedDate || undefined)}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transfer.status)}`}>
                  {transfer.status?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Amount Details
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Transfer Amount</p>
                <p className="text-3xl font-bold text-gray-900">{formatAmount(transfer.amount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sender & Recipient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sender */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Sender Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="font-medium text-gray-900">{organizationName || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Requested By</p>
                  <p className="font-medium text-gray-900">
                    {transfer.requester?.firstName} {transfer.requester?.lastName}
                  </p>
                  {transfer.requester?.email && (
                    <p className="text-sm text-gray-500">{transfer.requester.email}</p>
                  )}
                </div>
              </div>

              {transfer.approver && (
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Approved By</p>
                    <p className="font-medium text-gray-900">
                      {transfer.approver.firstName} {transfer.approver.lastName}
                    </p>
                    {transfer.approver.email && (
                      <p className="text-sm text-gray-500">{transfer.approver.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Recipient Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{transfer.recipient?.name || 'N/A'}</p>
                  {transfer.recipient?.email && (
                    <p className="text-sm text-gray-500">{transfer.recipient.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Account Details</p>
                  <p className="font-medium text-gray-900">
                    {transfer.recipient?.accountNumber || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">{transfer.recipient?.bankName || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Description */}
        {transfer.reason && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Transaction Description
            </h2>
            <div className="flex items-start">
              <FileText className="h-4 w-4 text-gray-400 mr-3 mt-1" />
              <p className="text-gray-700 leading-relaxed">{transfer.reason}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>This is an automatically generated receipt for your transfer transaction.</p>
            <p className="mt-1">Generated on {formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
