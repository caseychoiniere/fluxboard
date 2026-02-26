import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Accounts } from './components/Accounts';
import { AccountDetails } from './components/AccountDetails';
import { InsightsView } from './components/InsightsView';

// Placeholder components for other routes
const Settings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <div className="p-6">
          <h3 className="font-medium text-slate-900">Profile</h3>
          <p className="text-sm text-slate-500">Manage your personal information and preferences.</p>
        </div>
        <div className="p-6">
          <h3 className="font-medium text-slate-900">Account Connections</h3>
          <p className="text-sm text-slate-500">Connect or disconnect your bank accounts.</p>
        </div>
        <div className="p-6">
          <h3 className="font-medium text-slate-900">Notifications</h3>
          <p className="text-sm text-slate-500">Set alerts for unusual spending or low balances.</p>
        </div>
      </div>
    </div>
);

const App: React.FC = () => {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/:accountId" element={<AccountDetails />} />
            <Route path="/insights" element={<InsightsView />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
  );
};

export default App;
