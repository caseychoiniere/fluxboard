import React, { useState } from 'react';
import { Plus, Calendar, RotateCw, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { RecurringRule } from '../types';
import { MOCK_RECURRING_RULES } from '../constants';

export const RecurringRules: React.FC = () => {
  const [rules, setRules] = useState<RecurringRule[]>(MOCK_RECURRING_RULES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState: Partial<RecurringRule> = {
    merchantName: '',
    amount: 0,
    frequency: 'MONTHLY',
    category: 'Utilities',
    active: true,
    currency: 'USD',
    nextDueDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Partial<RecurringRule>>(initialFormState);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const handleEdit = (rule: RecurringRule) => {
    setEditingId(rule.id);
    setFormData(rule);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.merchantName || !formData.amount) return;
    
    if (editingId) {
        // Update existing
        setRules(rules.map(r => r.id === editingId ? { ...r, ...formData } as RecurringRule : r));
    } else {
        // Create new
        const rule: RecurringRule = {
            id: Math.random().toString(36).substr(2, 9),
            merchantName: formData.merchantName!,
            frequency: formData.frequency as any,
            amount: Number(formData.amount),
            currency: 'USD',
            category: formData.category || 'Uncategorized',
            nextDueDate: formData.nextDueDate || new Date().toISOString().split('T')[0],
            active: true
        };
        setRules([...rules, rule]);
    }

    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const toggleActive = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
        <AlertCircle className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
        <div>
            <h4 className="text-sm font-bold text-blue-900">About Recurring Rules</h4>
            <p className="text-sm text-blue-700 mt-1">
                Fluxboard automatically detects recurring patterns. You can also manually add rules here to help forecast your cash flow.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add/Edit Card */}
        {isFormOpen ? (
          <div className="bg-white p-6 rounded-xl border-2 border-brand-500 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-900">{editingId ? 'Edit Rule' : 'New Recurring Rule'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">Merchant</label>
                <input 
                  type="text" 
                  value={formData.merchantName}
                  onChange={(e) => setFormData({...formData, merchantName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                  placeholder="e.g. Netflix"
                />
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                    <label className="text-xs font-medium text-slate-500">Amount</label>
                    <input 
                      type="number" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                      placeholder="0.00"
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-xs font-medium text-slate-500">Frequency</label>
                    <select 
                        value={formData.frequency}
                        onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                    >
                        <option value="WEEKLY">Weekly</option>
                        <option value="BI-WEEKLY">Bi-Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                    </select>
                 </div>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                    <label className="text-xs font-medium text-slate-500">Category</label>
                    <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Entertainment"
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-xs font-medium text-slate-500">Next Due</label>
                    <input 
                    type="date" 
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                    />
                 </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handleSave}
                className="flex-1 bg-brand-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
              <button 
                onClick={handleCancel}
                className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleAddNew}
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-all group h-full min-h-[220px]"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-500 transition-colors mb-3">
                <Plus size={24} />
            </div>
            <p className="font-medium text-slate-600 group-hover:text-brand-700">Add New Rule</p>
          </button>
        )}

        {/* Existing Rules */}
        {rules.map(rule => (
          <div key={rule.id} className={`bg-white p-6 rounded-xl border transition-all ${rule.active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${rule.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <RotateCw size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-900">{rule.merchantName}</h3>
                    <p className="text-xs text-slate-500">{rule.frequency}</p>
                 </div>
              </div>
              <div className="flex gap-1">
                 <button 
                    onClick={() => handleEdit(rule)} 
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                >
                    <Edit2 size={16} />
                </button>
                <button 
                    onClick={() => toggleActive(rule.id)}
                    className={`p-1.5 rounded-md transition-colors ${rule.active ? 'text-brand-600 hover:bg-brand-50' : 'text-slate-400 hover:bg-slate-200'}`}
                    title={rule.active ? "Deactivate" : "Activate"}
                >
                    {rule.active ? <Check size={16} /> : <X size={16} />}
                </button>
                <button onClick={() => handleDelete(rule.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-end justify-between mt-6">
                <div>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md mb-2">
                        {rule.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} />
                        Next: {rule.nextDueDate}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                        {rule.amount.toLocaleString('en-US', { style: 'currency', currency: rule.currency })}
                    </p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};