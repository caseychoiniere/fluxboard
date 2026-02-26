import { Account, Transaction, MonthlySummary, CategorySpending, RecurringRule } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', userId: 'user_1', name: 'Main Checking', type: 'CHECKING', balance: 4250.00, currency: 'USD' },
  { id: '2', userId: 'user_1', name: 'High Yield Savings', type: 'SAVINGS', balance: 15000.00, currency: 'USD' },
  { id: '3', userId: 'user_1', name: 'Sapphire Credit', type: 'CREDIT_CARD', balance: -1240.50, currency: 'USD' },
  { id: '4', userId: 'user_1', name: 'Vanguard Brokerage', type: 'INVESTMENT', balance: 45000.00, currency: 'USD' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // MAY 2024
  { id: 't1', userId: 'user_1', accountId: '1', date: '2024-05-20', amount: -120.50, currency: 'USD', category: 'Groceries', merchant: 'Whole Foods', description: 'Weekly groceries', isRecurring: false },
  { id: 't2', userId: 'user_1', accountId: '1', date: '2024-05-19', amount: -45.00, currency: 'USD', category: 'Transport', merchant: 'Uber', description: 'Ride to airport', isRecurring: false },
  { id: 't3', userId: 'user_1', accountId: '3', date: '2024-05-18', amount: -250.00, currency: 'USD', category: 'Dining', merchant: 'Nobu', description: 'Dinner with friends', isRecurring: false },
  { id: 't4', userId: 'user_1', accountId: '1', date: '2024-05-15', amount: 3500.00, currency: 'USD', category: 'Income', merchant: 'Employer Inc', description: 'Bi-weekly Salary', isRecurring: true },
  { id: 't5', userId: 'user_1', accountId: '3', date: '2024-05-14', amount: -15.99, currency: 'USD', category: 'Entertainment', merchant: 'Netflix', description: 'Subscription', isRecurring: true },
  
  // APRIL 2024
  { id: 't6', userId: 'user_1', accountId: '1', date: '2024-04-28', amount: -85.00, currency: 'USD', category: 'Utilities', merchant: 'Electric Co', description: 'Monthly bill', isRecurring: true },
  { id: 't7', userId: 'user_1', accountId: '3', date: '2024-04-20', amount: -320.00, currency: 'USD', category: 'Shopping', merchant: 'Amazon', description: 'Electronics', isRecurring: false },
  { id: 't8', userId: 'user_1', accountId: '1', date: '2024-04-15', amount: 3500.00, currency: 'USD', category: 'Income', merchant: 'Employer Inc', description: 'Salary', isRecurring: true },
  { id: 't9', userId: 'user_1', accountId: '1', date: '2024-04-05', amount: -1200.00, currency: 'USD', category: 'Housing', merchant: 'Landlord LLC', description: 'Rent', isRecurring: true },
  
  // MARCH 2024
  { id: 't10', userId: 'user_1', accountId: '3', date: '2024-03-22', amount: -450.00, currency: 'USD', category: 'Dining', merchant: 'Steakhouse', description: 'Birthday dinner', isRecurring: false },
  { id: 't11', userId: 'user_1', accountId: '1', date: '2024-03-15', amount: 3700.00, currency: 'USD', category: 'Income', merchant: 'Employer Inc', description: 'Salary + Bonus', isRecurring: true },
  { id: 't12', userId: 'user_1', accountId: '1', date: '2024-03-01', amount: -1200.00, currency: 'USD', category: 'Housing', merchant: 'Landlord LLC', description: 'Rent', isRecurring: true },
  
  // FEBRUARY 2024
  { id: 't13', userId: 'user_1', accountId: '1', date: '2024-02-14', amount: -120.00, currency: 'USD', category: 'Dining', merchant: 'Bistro Royale', description: 'Valentines Dinner', isRecurring: false },
  { id: 't14', userId: 'user_1', accountId: '3', date: '2024-02-10', amount: -89.99, currency: 'USD', category: 'Shopping', merchant: 'Nike', description: 'Running Shoes', isRecurring: false },
  
  // JANUARY 2024
  { id: 't15', userId: 'user_1', accountId: '1', date: '2024-01-02', amount: -1200.00, currency: 'USD', category: 'Housing', merchant: 'Landlord LLC', description: 'Rent', isRecurring: true },
  { id: 't16', userId: 'user_1', accountId: '2', date: '2024-01-15', amount: 500.00, currency: 'USD', category: 'Income', merchant: 'Savings Interest', description: 'Quarterly Interest', isRecurring: false },
  
  // DECEMBER 2023
  { id: 't17', userId: 'user_1', accountId: '1', date: '2023-12-24', amount: -500.00, currency: 'USD', category: 'Shopping', merchant: 'Apple Store', description: 'Holiday Gifts', isRecurring: false },
  { id: 't18', userId: 'user_1', accountId: '1', date: '2023-12-15', amount: 5000.00, currency: 'USD', category: 'Income', merchant: 'Employer Inc', description: 'Salary + Holiday Bonus', isRecurring: true },
  
  // NOVEMBER 2023
  { id: 't19', userId: 'user_1', accountId: '3', date: '2023-11-25', amount: -850.00, currency: 'USD', category: 'Shopping', merchant: 'Best Buy', description: 'Black Friday TV', isRecurring: false },
  
  // OCTOBER 2023
  { id: 't20', userId: 'user_1', accountId: '1', date: '2023-10-12', amount: -210.00, currency: 'USD', category: 'Utilities', merchant: 'Heating Corp', description: 'Winter Prep', isRecurring: false },
  
  // SEPTEMBER 2023
  { id: 't21', userId: 'user_1', accountId: '1', date: '2023-09-05', amount: -150.00, currency: 'USD', category: 'Transport', merchant: 'Auto Repair', description: 'Oil change', isRecurring: false },
  
  // AUGUST 2023
  { id: 't22', userId: 'user_1', accountId: '1', date: '2023-08-20', amount: -1200.00, currency: 'USD', category: 'Travel', merchant: 'Airbnb', description: 'Summer Vacation', isRecurring: false },
];

export const MOCK_MONTHLY_SUMMARY: MonthlySummary[] = [
  { month: '2023-08', income: 6500, expenses: 5800, savings: 700 },
  { month: '2023-09', income: 6500, expenses: 4100, savings: 2400 },
  { month: '2023-10', income: 6600, expenses: 4300, savings: 2300 },
  { month: '2023-11', income: 6600, expenses: 5200, savings: 1400 },
  { month: '2023-12', income: 8500, expenses: 6400, savings: 2100 },
  { month: '2024-01', income: 7000, expenses: 4500, savings: 2500 },
  { month: '2024-02', income: 7000, expenses: 4800, savings: 2200 },
  { month: '2024-03', income: 7200, expenses: 5100, savings: 2100 },
  { month: '2024-04', income: 7000, expenses: 4200, savings: 2800 },
  { month: '2024-05', income: 3500, expenses: 2036.49, savings: 1463.51 },
];

export const MOCK_CATEGORY_SPENDING: CategorySpending[] = [
  { category: 'Housing', amount: 1200 },
  { category: 'Dining', amount: 450 },
  { category: 'Groceries', amount: 380 },
  { category: 'Shopping', amount: 320 },
  { category: 'Transport', amount: 150 },
  { category: 'Utilities', amount: 85 },
  { category: 'Entertainment', amount: 60 },
];

export const MOCK_RECURRING_RULES: RecurringRule[] = [
  { id: 'r1', merchantName: 'Netflix', frequency: 'MONTHLY', amount: 15.99, currency: 'USD', category: 'Entertainment', nextDueDate: '2024-06-14', active: true },
  { id: 'r2', merchantName: 'Landlord LLC', frequency: 'MONTHLY', amount: 1200.00, currency: 'USD', category: 'Housing', nextDueDate: '2024-06-05', active: true },
  { id: 'r3', merchantName: 'Spotify', frequency: 'MONTHLY', amount: 10.99, currency: 'USD', category: 'Entertainment', nextDueDate: '2024-06-20', active: true },
  { id: 'r4', merchantName: 'Electric Co', frequency: 'MONTHLY', amount: 85.00, currency: 'USD', category: 'Utilities', nextDueDate: '2024-06-12', active: true },
  { id: 'r5', merchantName: 'Employer Inc', frequency: 'BI-WEEKLY', amount: 3500.00, currency: 'USD', category: 'Income', nextDueDate: '2024-05-29', active: true },
];