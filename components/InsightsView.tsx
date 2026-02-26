
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, ReferenceLine
} from 'recharts';
import {
    Sparkles, TrendingUp, TrendingDown, AlertCircle,
    ArrowRight, BrainCircuit, RefreshCw, Zap
} from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_MONTHLY_SUMMARY } from '../constants';
import { getDeepAnalysis } from '../services/geminiService';

export const InsightsView: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDeepAnalysis({
                transactions: MOCK_TRANSACTIONS,
                summary: MOCK_MONTHLY_SUMMARY
            });
            setAnalysis(data);
        } catch (err: any) {
            // The service now returns human-readable error strings
            setError(err.message || "Failed to generate AI insights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const combinedChartData = useMemo(() => {
        if (!analysis) return MOCK_MONTHLY_SUMMARY.map(s => ({ ...s, type: 'HISTORICAL' }));

        const historical = MOCK_MONTHLY_SUMMARY.map(s => ({
            month: s.month,
            expenses: s.expenses,
            income: s.income,
            type: 'HISTORICAL'
        }));

        const forecasted = analysis.forecast.map((f: any) => ({
            month: f.month,
            expenses: f.predictedAmount,
            type: 'FORECAST'
        }));

        return [...historical, ...forecasted];
    }, [analysis]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
                    <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 w-6 h-6" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900">Consulting Flux AI...</h3>
                    <p className="text-sm text-slate-500">Reviewing 9 months of spending patterns and identifying trends.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-white rounded-xl border border-red-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-red-500 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Analysis Unavailable</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">{error}</p>
                <button
                    onClick={fetchAnalysis}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all active:scale-95"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Deep Insights <Sparkles className="text-amber-400 w-6 h-6 fill-amber-400" />
                    </h1>
                    <p className="text-slate-500">AI-powered pattern recognition and future forecasting.</p>
                </div>
                <button
                    onClick={fetchAnalysis}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh Analysis
                </button>
            </header>

            {/* Summary Hero */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap size={120} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Executive Summary
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        {analysis?.summary}
                    </p>
                </div>
            </div>

            {/* Forecast Chart */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900">3-Month Expense Forecast</h3>
                    <p className="text-sm text-slate-500">Projected spending based on historical seasonality and recurring rules.</p>
                </div>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={combinedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickFormatter={(val) => `$${val/1000}k`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 min-w-[160px]">
                                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{data.month}</p>
                                                <div className="space-y-1">
                                                    <p className="flex justify-between text-sm">
                                                        <span className="text-slate-500">Expenses</span>
                                                        <span className="font-bold text-slate-900">${data.expenses.toLocaleString()}</span>
                                                    </p>
                                                    <p className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 w-fit mt-2">
                                                        {data.type === 'FORECAST' ? '🔮 AI PREDICTION' : '✅ VERIFIED'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#22c55e"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorHistorical)"
                            />
                            <ReferenceLine x={MOCK_MONTHLY_SUMMARY[MOCK_MONTHLY_SUMMARY.length - 1].month} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#64748b', fontSize: 12 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pattern Recognition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis?.patterns.map((pattern: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                            pattern.impact === 'POSITIVE' ? 'bg-green-50 text-green-600' :
                                pattern.impact === 'NEGATIVE' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {pattern.impact === 'POSITIVE' ? <TrendingUp size={24} /> :
                                pattern.impact === 'NEGATIVE' ? <TrendingDown size={24} /> : <Zap size={24} />}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{pattern.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            {pattern.description}
                        </p>
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                            Take Action <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
