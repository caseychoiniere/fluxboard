import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Transaction } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { createTransaction as apiCreateTransaction, updateTransaction as apiUpdateTransaction } from '../services/transactionService';

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'accountId'>) => Promise<void>;
    editTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
    loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [loading, setLoading] = useState(false);

    const addTransaction = useCallback(async (data: Omit<Transaction, 'id' | 'userId' | 'accountId'>) => {
        setLoading(true);
        try {
            const newTransaction = await apiCreateTransaction(data);
            setTransactions(prev => [newTransaction, ...prev]);
        } finally {
            setLoading(false);
        }
    }, []);

    const editTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
        setLoading(true);
        try {
            const updatedTransaction = await apiUpdateTransaction(id, data);
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t));
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, editTransaction, loading }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
