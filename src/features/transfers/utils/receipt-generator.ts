import type { TransferRequestView } from '../../../api/models/TransferRequestView';

export interface ReceiptData {
  transfer: TransferRequestView;
  organizationName?: string;
}

export const generateReceiptHTML = (data: ReceiptData): string => {
  const { transfer, organizationName } = data;

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
        return 'color: #059669; background-color: #ecfdf5; border-color: #a7f3d0;';
      case 'approved':
        return 'color: #2563eb; background-color: #eff6ff; border-color: #93c5fd;';
      default:
        return 'color: #4b5563; background-color: #f9fafb; border-color: #d1d5db;';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transfer Receipt - ${transfer.reference || 'N/A'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #111827;
          background-color: #f9fafb;
          padding: 20px;
        }
        
        .receipt-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 40px 30px;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .header p {
          color: #bfdbfe;
          font-size: 16px;
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
        }
        
        .status-icon {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          fill: #86efac;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 20px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        .grid-single {
          display: grid;
          grid-template-columns: 1fr;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .info-icon {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          margin-top: 2px;
          fill: #9ca3af;
        }
        
        .info-content {
          flex: 1;
        }
        
        .info-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 2px;
        }
        
        .info-value {
          font-weight: 500;
          color: #111827;
          font-size: 16px;
        }
        
        .info-sub {
          font-size: 14px;
          color: #6b7280;
          margin-top: 2px;
        }
        
        .amount-highlight {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
        }
        
        .amount-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .amount-value {
          font-size: 36px;
          font-weight: bold;
          color: #111827;
        }
        
        .status-badge-inline {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid;
        }
        
        .description {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #2563eb;
        }
        
        .footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        .footer p {
          margin-bottom: 4px;
        }
        
        @media print {
          body {
            background-color: white;
            padding: 0;
          }
          
          .receipt-container {
            box-shadow: none;
            max-width: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <div class="header-content">
            <div>
              <h1>Transfer Receipt</h1>
              <p>Payment Confirmation</p>
            </div>
            <div class="status-badge">
              <svg class="status-icon" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Completed
            </div>
          </div>
        </div>
        
        <div class="content">
          <div class="grid">
            <div class="section">
              <h2 class="section-title">Transaction Details</h2>
              
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
                <div class="info-content">
                  <div class="info-label">Reference</div>
                  <div class="info-value">${transfer.reference || 'N/A'}</div>
                </div>
              </div>
              
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <div class="info-content">
                  <div class="info-label">Date Processed</div>
                  <div class="info-value">${formatDate(transfer.processedDate || transfer.approvedDate || undefined)}</div>
                </div>
              </div>
              
              <div class="info-item">
                <div class="status-badge-inline" style="${getStatusColor(transfer.status)}">
                  ${transfer.status?.toUpperCase() || 'N/A'}
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Amount Details</h2>
              <div class="amount-highlight">
                <div class="amount-label">Transfer Amount</div>
                <div class="amount-value">${formatAmount(transfer.amount)}</div>
              </div>
            </div>
          </div>
          
          <div class="grid">
            <div class="section">
              <h2 class="section-title">Sender Information</h2>
              
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8 0a2 2 0 104 0 2 2 0 00-4 0z" clip-rule="evenodd" />
                </svg>
                <div class="info-content">
                  <div class="info-label">Organization</div>
                  <div class="info-value">${organizationName || 'N/A'}</div>
                </div>
              </div>
              
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <div class="info-content">
                  <div class="info-label">Requested By</div>
                  <div class="info-value">${transfer.requester?.firstName || ''} ${transfer.requester?.lastName || ''}</div>
                  ${transfer.requester?.email ? `<div class="info-sub">${transfer.requester.email}</div>` : ''}
                </div>
              </div>
              
              ${transfer.approver ? `
                <div class="info-item">
                  <svg class="info-icon" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <div class="info-content">
                    <div class="info-label">Approved By</div>
                    <div class="info-value">${transfer.approver.firstName || ''} ${transfer.approver.lastName || ''}</div>
                    ${transfer.approver.email ? `<div class="info-sub">${transfer.approver.email}</div>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
            
            <div class="section">
              <h2 class="section-title">Recipient Information</h2>
              
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <div class="info-content">
                  <div class="info-label">Name</div>
                  <div class="info-value">${transfer.recipient?.name || 'N/A'}</div>
                  ${transfer.recipient?.email ? `<div class="info-sub">${transfer.recipient.email}</div>` : ''}
                </div>
              </div>
              
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                <div class="info-content">
                  <div class="info-label">Account Details</div>
                  <div class="info-value">${transfer.recipient?.accountNumber || 'N/A'}</div>
                  <div class="info-sub">${transfer.recipient?.bankName || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
          
          ${transfer.reason ? `
            <div class="section">
              <h2 class="section-title">Transaction Description</h2>
              <div class="description">
                <p>${transfer.reason}</p>
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>This is an automatically generated receipt for your transfer transaction.</p>
            <p>Generated on ${formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadReceiptAsPDF = async (data: ReceiptData): Promise<void> => {
  const html = generateReceiptHTML(data);
  
  // Create a new window/tab for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please check your popup blocker settings.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (user can cancel this)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);
  };
};

export const downloadReceiptAsHTML = (data: ReceiptData): void => {
  const html = generateReceiptHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `transfer-receipt-${data.transfer.reference || 'unknown'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const previewReceipt = (data: ReceiptData): void => {
  const html = generateReceiptHTML(data);
  
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    throw new Error('Unable to open preview window. Please check your popup blocker settings.');
  }
  
  previewWindow.document.write(html);
  previewWindow.document.close();
};
