import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Building, TrendingUp, Download, Filter, Loader2 } from 'lucide-react';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../constants';
import { exportTransactionsToCSV } from '../services/exportService';

export const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const account = MOCK_ACCOUNTS.find(a => a.id === accountId);
  
  const transactions = useMemo(() => 
    MOCK_TRANSACTIONS.filter(t => t.accountId === accountId),
  [accountId]);

  if (!account) {
    return (
        <div className="space-y-6">
            <button 
                onClick={() => navigate('/accounts')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Accounts
            </button>
            <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                Account not found
            </div>
        </div>
    );
  }

  const handleExport = () => {
    if (transactions.length === 0) return;
    
    setIsExporting(true);
    setTimeout(() => {
      exportTransactionsToCSV(transactions, `fluxboard_${account.name.toLowerCase().replace(/\s+/g, '_')}`);
      setIsExporting(false);
    }, 600);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'CHECKING': return Building;
      case 'SAVINGS': return Wallet;
      case 'CREDIT_CARD': return CreditCard;
      case 'INVESTMENT': return TrendingUp;
      default: return Wallet;
    }
  };

  const Icon = getIcon(account.type);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/accounts')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Accounts
      </button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-50 text-brand-600 rounded-xl">
            <Icon size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{account.type.replace('_', ' ')}</p>
            <h1 className="text-2xl font-bold text-slate-900">{account.name}</h1>
          </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-medium text-slate-500">Current Balance</p>
            <p className="text-3xl font-bold text-slate-900">
                {account.balance.toLocaleString('en-US', { style: 'currency', currency: account.currency })}
            </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
           <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50">
              <Filter size={14} /> Filter
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting || transactions.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-95"
            >
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
        
        {transactions.length === 0 ? (
             <div className="p-12 text-center text-slate-400 bg-slate-50/30">No recent transactions found for this account.</div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Merchant</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{t.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{t.merchant}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {t.category}
                        </span>
                      </td>
                       <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{t.description}</td>
                      <td className={`px-6 py-4 text-right font-medium ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: t.currency })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
    </div>
  );
};