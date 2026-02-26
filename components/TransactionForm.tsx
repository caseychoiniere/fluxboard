import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2, Calendar, DollarSign, Tag, ShoppingBag, FileText } from 'lucide-react';
import { createTransaction, updateTransaction } from '../services/transactionService';
import { Transaction } from '../types';

interface TransactionFormProps {
  onClose: () => void;
  onSuccess: (transaction: Transaction) => void;
  transaction?: Transaction;
}

const CATEGORIES = [
  'Groceries',
  'Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Housing',
  'Health',
  'Income',
  'Other'
];

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSuccess, transaction }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    merchant: '',
    category: 'Groceries',
    description: '',
    isRecurring: false,
    currency: 'USD'
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: Math.abs(transaction.amount).toString(),
        merchant: transaction.merchant,
        category: transaction.category,
        description: transaction.description || '',
        isRecurring: transaction.isRecurring,
        currency: transaction.currency
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || !formData.merchant) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      const finalAmount = formData.category === 'Income' ? Math.abs(amount) : -Math.abs(amount);

      let result: Transaction;
      if (transaction) {
        result = await updateTransaction(transaction.id, {
          date: formData.date,
          amount: finalAmount,
          currency: formData.currency,
          category: formData.category,
          merchant: formData.merchant,
          description: formData.description,
          isRecurring: formData.isRecurring
        });
      } else {
        result = await createTransaction({
          date: formData.date,
          amount: finalAmount,
          currency: formData.currency,
          category: formData.category,
          merchant: formData.merchant,
          description: formData.description,
          isRecurring: formData.isRecurring
        });
      }

      onSuccess(result);
      onClose();
    } catch (err) {
      setError(`Failed to ${transaction ? 'update' : 'create'} transaction. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
            )}

            <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Amount & Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign size={12} /> Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} /> Date
                  </label>
                  <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-600"
                  />
                </div>
              </div>

              {/* Merchant */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <ShoppingBag size={12} /> Merchant
                </label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Starbucks, Amazon"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={12} /> Category
                </label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-700"
                >
                  {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={12} /> Description (Optional)
                </label>
                <textarea
                    rows={3}
                    placeholder="Add notes about this transaction..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                />
              </div>

              {/* Recurring Toggle */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isRecurring ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-300'}`}>
                  {formData.isRecurring && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className="text-sm font-medium text-slate-700">This is a recurring transaction</span>
              </div>

            </form>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
                form="transaction-form"
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-brand-200"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
              ) : (
                  'Save Transaction'
              )}
            </button>
          </div>
        </div>
      </div>
  );
};
