import React, { useState, useCallback } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { generateFinancialInsight } from '../services/geminiService';
import { MOCK_TRANSACTIONS, MOCK_ACCOUNTS, MOCK_MONTHLY_SUMMARY } from '../constants';

export const AIQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ answer: string; suggestedAction?: string } | null>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    const result = await generateFinancialInsight(query, {
      transactions: MOCK_TRANSACTIONS,
      accounts: MOCK_ACCOUNTS,
      summary: MOCK_MONTHLY_SUMMARY
    });

    setResponse(result);
    setLoading(false);
  }, [query]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-brand-500 w-5 h-5" />
        <h2 className="text-lg font-semibold text-slate-800">Ask Flux AI</h2>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question like 'Why did I spend so much on dining last month?'"
          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 p-1.5 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-brand-50/50 rounded-lg border border-brand-100 animate-in fade-in slide-in-from-top-2">
          <p className="text-slate-700 text-sm leading-relaxed">{response.answer}</p>
          {response.suggestedAction && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-100/50 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3 h-3" />
              Suggestion: {response.suggestedAction}
            </div>
          )}
        </div>
      )}
    </div>
  );
};