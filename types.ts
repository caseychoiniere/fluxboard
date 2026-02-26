export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  date: string; // ISO Date string
  amount: number;
  currency: string;
  category: string;
  merchant: string;
  description: string;
  isRecurring: boolean;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT';
  balance: number;
  currency: string;
}

export interface Insight {
  id: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  title: string;
  message: string;
  date: string;
}

export interface MonthlySummary {
  month: string; // "YYYY-MM"
  income: number;
  expenses: number;
  savings: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface AIQueryResponse {
  answer: string;
  relatedChart?: 'SPENDING_TREND' | 'CATEGORY_BREAKDOWN' | 'NET_WORTH' | null;
}

export interface RecurringRule {
  id: string;
  merchantName: string;
  frequency: 'WEEKLY' | 'BI-WEEKLY' | 'MONTHLY' | 'YEARLY';
  amount: number;
  currency: string;
  category: string;
  nextDueDate: string;
  active: boolean;
}