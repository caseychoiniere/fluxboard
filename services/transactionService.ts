import { Transaction } from '../types';

export interface ImportResult {
    success: boolean;
    count: number;
    message: string;
}

export const uploadTransactionsCSV = async (file: File): Promise<ImportResult> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock validation logic
    if (!file.name.endsWith('.csv')) {
        throw new Error('Invalid file type. Please upload a CSV file.');
    }

    // Return mock success response
    return {
        success: true,
        count: Math.floor(Math.random() * 20) + 5, // Random number of "imported" transactions
        message: 'Transactions processed successfully'
    };
};

export const createTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'accountId'>): Promise<Transaction> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'user_1',
        accountId: '1', // Default to main account for mock
        ...data
    };
};

export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        id,
        userId: 'user_1',
        accountId: '1',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        currency: 'USD',
        category: 'Other',
        merchant: 'Unknown',
        description: '',
        isRecurring: false,
        ...data
    } as Transaction;
};
