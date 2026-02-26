import React, { useState } from 'react';
import { Search, Filter, Download, History, RotateCw, UploadCloud, Plus, Loader2 } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../constants';
import { RecurringRules } from './RecurringRules';
import { TransactionImport } from './TransactionImport';
import { TransactionForm } from './TransactionForm';
import { exportTransactionsToCSV } from '../services/exportService';

export const Transactions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'recurring'>('history');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Local state for transactions to support "adding" new ones in this mock environment
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const filteredTransactions = transactions.filter(t => 
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;
    
    setIsExporting(true);
    // Slight delay to show the "Exporting" state for better UX feedback
    setTimeout(() => {
      exportTransactionsToCSV(filteredTransactions);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 text-sm">Manage your spending and recurring payments.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white border border-brand-600 rounded-lg text-sm font-medium hover:bg-brand-700 shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} /> Add Transaction
          </button>
          <button 
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-all active:scale-95"
          >
            <UploadCloud size={16} /> Import CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting || filteredTransactions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-95"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
            <button 
                onClick={() => setActiveTab('history')}
                className={`pb-3 flex items-center gap-2 text-sm font-medium transition-all relative ${
                    activeTab === 'history' 
                    ? 'text-brand-600 border-b-2 border-brand-500' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
            >
                <History size={16} />
                History
            </button>
            <button 
                onClick={() => setActiveTab('recurring')}
                className={`pb-3 flex items-center gap-2 text-sm font-medium transition-all relative ${
                    activeTab === 'recurring' 
                    ? 'text-brand-600 border-b-2 border-brand-500' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
            >
                <RotateCw size={16} />
                Recurring Rules
                <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full ml-1">5</span>
            </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                type="text" 
                placeholder="Search merchants, categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
            </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Merchant</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{t.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                          {t.merchant.charAt(0)}
                        </div>
                        {t.merchant}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{t.description}</td>
                      <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: t.currency })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${t.isRecurring ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}>
                          {t.isRecurring ? <RotateCw size={12} /> : null}
                          {t.isRecurring ? 'Recurring' : 'One-time'}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No transactions found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredTransactions.length} results</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">Next</button>
              </div>
            </div>
        </div>
      ) : (
        <RecurringRules />
      )}

      {showImport && (
        <TransactionImport 
          onClose={() => setShowImport(false)} 
          onSuccess={() => {
            console.log('Refresh transactions');
            setActiveTab('history');
          }} 
        />
      )}

      {showAddForm && (
        <TransactionForm
          onClose={() => setShowAddForm(false)}
          onSuccess={(newTransaction) => {
             setTransactions([newTransaction, ...transactions]);
          }}
        />
      )}
    </div>
  );
};