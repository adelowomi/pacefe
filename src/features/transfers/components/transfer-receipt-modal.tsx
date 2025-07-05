import React, { useState } from 'react';
import { X, Download, Eye, FileText, Printer } from 'lucide-react';
import TransferReceipt from './transfer-receipt';
import { downloadReceiptAsPDF, downloadReceiptAsHTML, previewReceipt, type ReceiptData } from '../utils/receipt-generator';
import type { TransferRequestView } from '../../../api/models/TransferRequestView';

interface TransferReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: TransferRequestView;
  organizationName?: string;
}

export default function TransferReceiptModal({ 
  isOpen, 
  onClose, 
  transfer, 
  organizationName 
}: TransferReceiptModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const receiptData: ReceiptData = {
    transfer,
    organizationName
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      await downloadReceiptAsPDF(receiptData);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHTML = () => {
    try {
      setDownloadError(null);
      downloadReceiptAsHTML(receiptData);
    } catch (error) {
      console.error('Failed to download HTML:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to download HTML');
    }
  };

  const handlePreview = () => {
    try {
      setDownloadError(null);
      previewReceipt(receiptData);
    } catch (error) {
      console.error('Failed to preview receipt:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to preview receipt');
    }
  };

  const handleReceiptDownload = () => {
    handleDownloadPDF();
  };

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Transfer Receipt</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Receipt for transfer reference: {transfer.reference || 'N/A'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreview}
                className="inline-flex items-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              
              <button
                onClick={handleDownloadHTML}
                className="inline-flex items-center px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download HTML
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4 mr-2" />
                  Print/Save as PDF
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {downloadError && (
            <div className="mx-6 mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{downloadError}</p>
            </div>
          )}

          {/* Receipt Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6">
              <TransferReceipt
                transfer={transfer}
                onDownload={handleReceiptDownload}
                organizationName={organizationName}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-border bg-muted/30">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
