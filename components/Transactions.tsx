import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, History, RotateCw, UploadCloud, Plus, Loader2, X, Calendar, DollarSign, ListFilter } from 'lucide-react';
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
  
  // Filter States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState<'all' | 'recurring' | 'one-time'>('all');

  // Local state for transactions to support "adding" new ones
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search term filter
      const matchesSearch = 
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Date range filter
      if (dateRange.start && t.date < dateRange.start) return false;
      if (dateRange.end && t.date > dateRange.end) return false;

      // Amount range filter (using absolute value for easier range filtering of expenses)
      const absAmount = Math.abs(t.amount);
      if (amountRange.min && absAmount < parseFloat(amountRange.min)) return false;
      if (amountRange.max && absAmount > parseFloat(amountRange.max)) return false;

      // Status filter
      if (statusFilter === 'recurring' && !t.isRecurring) return false;
      if (statusFilter === 'one-time' && t.isRecurring) return false;

      return true;
    });
  }, [transactions, searchTerm, dateRange, amountRange, statusFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
    setAmountRange({ min: '', max: '' });
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || dateRange.start !== '' || dateRange.end !== '' || amountRange.min !== '' || amountRange.max !== '' || statusFilter !== 'all';

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;
    
    setIsExporting(true);
    setTimeout(() => {
      exportTransactionsToCSV(filteredTransactions);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
          <button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              showFilterPanel || hasActiveFilters 
                ? 'bg-brand-50 border-brand-200 text-brand-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={16} /> 
            Filters
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            )}
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

      {/* Filter Panel */}
      {showFilterPanel && activeTab === 'history' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ListFilter size={18} className="text-brand-500" />
              Advanced Filters
            </h3>
            <button 
              onClick={clearFilters}
              className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} /> Date Range
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input 
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={12} /> Amount Range
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  placeholder="Min"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input 
                  type="number"
                  placeholder="Max"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <RotateCw size={12} /> Status
              </label>
              <div className="flex p-1 bg-slate-50 rounded-lg border border-slate-200">
                {(['all', 'recurring', 'one-time'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                      statusFilter === status 
                        ? 'bg-white text-brand-600 shadow-sm border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {status.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search merchants, categories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                      <X size={14} />
                    </button>
                  )}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {filteredTransactions.length} of {transactions.length} transactions
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
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search size={32} className="text-slate-300" />
                          <p>No transactions found matching your filters</p>
                          <button 
                            onClick={clearFilters}
                            className="text-brand-600 text-xs font-bold hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
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