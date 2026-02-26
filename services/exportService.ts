import { Transaction } from '../types';

/**
 * Converts an array of transactions to a CSV string and triggers a browser download.
 */
export const exportTransactionsToCSV = (transactions: Transaction[], filenamePrefix: string = 'fluxboard_transactions'): void => {
  if (transactions.length === 0) return;

  const headers = ['Date', 'Merchant', 'Category', 'Description', 'Amount', 'Currency', 'Is Recurring'];
  
  // Helper to escape CSV values containing commas or quotes
  const escapeCSV = (val: any) => {
    if (typeof val === 'string') {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const rows = transactions.map(t => [
    t.date,
    escapeCSV(t.merchant),
    escapeCSV(t.category),
    escapeCSV(t.description),
    t.amount,
    t.currency,
    t.isRecurring ? 'Yes' : 'No'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};