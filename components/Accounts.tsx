import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, Building, TrendingUp, ChevronRight } from 'lucide-react';
import { MOCK_ACCOUNTS } from '../constants';

export const Accounts: React.FC = () => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'CHECKING': return Building;
      case 'SAVINGS': return Wallet;
      case 'CREDIT_CARD': return CreditCard;
      case 'INVESTMENT': return TrendingUp;
      default: return Wallet;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
        <p className="text-slate-500 text-sm">View and manage your connected financial accounts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ACCOUNTS.map((account) => {
          const Icon = getIcon(account.type);
          return (
            <div
              key={account.id}
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-lg text-brand-600 group-hover:bg-brand-50 transition-colors">
                  <Icon size={24} />
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{account.type.replace('_', ' ')}</p>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{account.name}</h3>
              <p className="text-2xl font-bold text-slate-900">
                {account.balance.toLocaleString('en-US', { style: 'currency', currency: account.currency })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};