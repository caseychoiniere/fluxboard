import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp, Edit2 } from 'lucide-react';
import { AIQuery } from './AIQuery';
import { TransactionForm } from './TransactionForm';
import { useTransactions } from '../contexts/TransactionContext';
import { MOCK_ACCOUNTS, MOCK_MONTHLY_SUMMARY } from '../constants';
import { Transaction } from '../types';

const StatCard: React.FC<{
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
}> = ({ title, value, trend, trendUp, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
);

export const Dashboard: React.FC = () => {
  const { transactions, editTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const totalBalance = useMemo(() =>
          MOCK_ACCOUNTS.reduce((acc, curr) => acc + curr.balance, 0),
      []);

  const monthlyExpense = useMemo(() => {
    const lastMonth = MOCK_MONTHLY_SUMMARY[MOCK_MONTHLY_SUMMARY.length - 1];
    return lastMonth ? lastMonth.expenses : 0;
  }, []);

  const netWorthTrend = useMemo(() => {
    let runningTotal = 50000; // Starting baseline for mock
    return MOCK_MONTHLY_SUMMARY.map(m => {
      runningTotal += (m.income - m.expenses);
      return { month: m.month, value: runningTotal };
    });
  }, []);

  return (
      <div className="space-y-6">
        {editingTransaction && (
            <TransactionForm
                transaction={editingTransaction}
                onClose={() => setEditingTransaction(null)}
                onSuccess={(updated) => {
                  editTransaction(updated.id, updated);
                  setEditingTransaction(null);
                }}
            />
        )}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, here's what's happening with your money.</p>
        </header>

        <AIQuery />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
              title="Total Net Worth"
              value={`$${totalBalance.toLocaleString()}`}
              trend="+12.5% vs last month"
              trendUp={true}
              icon={Wallet}
          />
          <StatCard
              title="Monthly Spending"
              value={`$${monthlyExpense.toLocaleString()}`}
              trend="-2.4% vs last month"
              trendUp={false} // Good that spending is down, visual logic might vary but let's assume green is good?
              // Actually usually red is down arrow, green is up arrow. Let's stick to literal direction.
              // Red arrow down for spending might be visually confusing. Let's swap logic: Green is always good context.
              // For spending, down is good (Green).
              icon={DollarSign}
          />
          <StatCard
              title="Savings Rate"
              value="32%"
              trend="+5.2% vs last year"
              trendUp={true}
              icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Income vs Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY_SUMMARY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Net Worth Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netWorthTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
            <button className="text-sm text-brand-600 font-medium hover:text-brand-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 5).map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-slate-500">{t.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{t.merchant}</td>
                    <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {t.category}
                  </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('en-US', { style: 'currency', currency: t.currency })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                          onClick={() => setEditingTransaction(t)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Edit Transaction"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};
