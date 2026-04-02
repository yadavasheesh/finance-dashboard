import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Salary',
  'Freelance',
  'Investment',
  'Rent',
  'Education',
  'Travel',
];

export const CATEGORY_ICONS = {
  'Food & Dining':  '🍜',
  'Transport':      '🚌',
  'Shopping':       '🛍️',
  'Entertainment':  '🎬',
  'Healthcare':     '🏥',
  'Utilities':      '💡',
  'Salary':         '💼',
  'Freelance':      '💻',
  'Investment':     '📈',
  'Rent':           '🏠',
  'Education':      '📚',
  'Travel':         '✈️',
};

export const CATEGORY_COLORS = {
  'Food & Dining':  '#ff6b6b',
  'Transport':      '#5b8dee',
  'Shopping':       '#a78bfa',
  'Entertainment':  '#f5c842',
  'Healthcare':     '#3ed9c0',
  'Utilities':      '#fb923c',
  'Salary':         '#34d399',
  'Freelance':      '#60a5fa',
  'Investment':     '#f472b6',
  'Rent':           '#94a3b8',
  'Education':      '#c084fc',
  'Travel':         '#2dd4bf',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_TRANSACTIONS = [
  // Current month
  { id: generateId(), date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, type: 'income', category: 'Salary' },
  { id: generateId(), date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Swiggy Order', amount: -450, type: 'expense', category: 'Food & Dining' },
  { id: generateId(), date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), description: 'Metro Card Recharge', amount: -500, type: 'expense', category: 'Transport' },
  { id: generateId(), date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), description: 'Netflix Subscription', amount: -649, type: 'expense', category: 'Entertainment' },
  { id: generateId(), date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), description: 'Amazon Shopping', amount: -3200, type: 'expense', category: 'Shopping' },
  { id: generateId(), date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), description: 'Freelance Project - UI Design', amount: 22000, type: 'income', category: 'Freelance' },
  { id: generateId(), date: format(subDays(new Date(), 7), 'yyyy-MM-dd'), description: 'House Rent', amount: -18000, type: 'expense', category: 'Rent' },
  { id: generateId(), date: format(subDays(new Date(), 8), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: -1200, type: 'expense', category: 'Utilities' },
  { id: generateId(), date: format(subDays(new Date(), 9), 'yyyy-MM-dd'), description: 'Zomato Lunch', amount: -380, type: 'expense', category: 'Food & Dining' },
  { id: generateId(), date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), description: 'Ola Cab', amount: -250, type: 'expense', category: 'Transport' },
  { id: generateId(), date: format(subDays(new Date(), 11), 'yyyy-MM-dd'), description: 'Gym Membership', amount: -2000, type: 'expense', category: 'Healthcare' },
  { id: generateId(), date: format(subDays(new Date(), 12), 'yyyy-MM-dd'), description: 'Udemy Course', amount: -1299, type: 'expense', category: 'Education' },
  { id: generateId(), date: format(subDays(new Date(), 13), 'yyyy-MM-dd'), description: 'Mutual Fund SIP', amount: -5000, type: 'expense', category: 'Investment' },
  { id: generateId(), date: format(subDays(new Date(), 14), 'yyyy-MM-dd'), description: 'Dinner with Friends', amount: -1800, type: 'expense', category: 'Food & Dining' },
  { id: generateId(), date: format(subDays(new Date(), 15), 'yyyy-MM-dd'), description: 'Freelance Bonus', amount: 8000, type: 'income', category: 'Freelance' },
  { id: generateId(), date: format(subDays(new Date(), 16), 'yyyy-MM-dd'), description: 'Flipkart Sale', amount: -4500, type: 'expense', category: 'Shopping' },
  { id: generateId(), date: format(subDays(new Date(), 17), 'yyyy-MM-dd'), description: 'Water Bill', amount: -300, type: 'expense', category: 'Utilities' },
  { id: generateId(), date: format(subDays(new Date(), 18), 'yyyy-MM-dd'), description: 'Movie Tickets', amount: -850, type: 'expense', category: 'Entertainment' },
  { id: generateId(), date: format(subDays(new Date(), 19), 'yyyy-MM-dd'), description: 'Doctor Visit', amount: -800, type: 'expense', category: 'Healthcare' },
  { id: generateId(), date: format(subDays(new Date(), 20), 'yyyy-MM-dd'), description: 'Train Tickets', amount: -1200, type: 'expense', category: 'Travel' },
  // Previous month
  { id: generateId(), date: format(subDays(new Date(), 32), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, type: 'income', category: 'Salary' },
  { id: generateId(), date: format(subDays(new Date(), 33), 'yyyy-MM-dd'), description: 'House Rent', amount: -18000, type: 'expense', category: 'Rent' },
  { id: generateId(), date: format(subDays(new Date(), 34), 'yyyy-MM-dd'), description: 'Swiggy', amount: -620, type: 'expense', category: 'Food & Dining' },
  { id: generateId(), date: format(subDays(new Date(), 35), 'yyyy-MM-dd'), description: 'Metro Recharge', amount: -500, type: 'expense', category: 'Transport' },
  { id: generateId(), date: format(subDays(new Date(), 36), 'yyyy-MM-dd'), description: 'Freelance - React App', amount: 30000, type: 'income', category: 'Freelance' },
  { id: generateId(), date: format(subDays(new Date(), 37), 'yyyy-MM-dd'), description: 'Amazon Purchase', amount: -2800, type: 'expense', category: 'Shopping' },
  { id: generateId(), date: format(subDays(new Date(), 38), 'yyyy-MM-dd'), description: 'Netflix', amount: -649, type: 'expense', category: 'Entertainment' },
  { id: generateId(), date: format(subDays(new Date(), 39), 'yyyy-MM-dd'), description: 'Electricity', amount: -1100, type: 'expense', category: 'Utilities' },
  { id: generateId(), date: format(subDays(new Date(), 40), 'yyyy-MM-dd'), description: 'Mutual Fund SIP', amount: -5000, type: 'expense', category: 'Investment' },
  { id: generateId(), date: format(subDays(new Date(), 41), 'yyyy-MM-dd'), description: 'Travel - Goa Trip', amount: -12000, type: 'expense', category: 'Travel' },
  { id: generateId(), date: format(subDays(new Date(), 45), 'yyyy-MM-dd'), description: 'Gym', amount: -2000, type: 'expense', category: 'Healthcare' },
  { id: generateId(), date: format(subDays(new Date(), 46), 'yyyy-MM-dd'), description: 'Pharmacy', amount: -450, type: 'expense', category: 'Healthcare' },
  { id: generateId(), date: format(subDays(new Date(), 47), 'yyyy-MM-dd'), description: 'Book Purchase', amount: -800, type: 'expense', category: 'Education' },
  { id: generateId(), date: format(subDays(new Date(), 48), 'yyyy-MM-dd'), description: 'Concert Tickets', amount: -2500, type: 'expense', category: 'Entertainment' },
  { id: generateId(), date: format(subDays(new Date(), 55), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, type: 'income', category: 'Salary' },
  { id: generateId(), date: format(subDays(new Date(), 56), 'yyyy-MM-dd'), description: 'House Rent', amount: -18000, type: 'expense', category: 'Rent' },
  { id: generateId(), date: format(subDays(new Date(), 57), 'yyyy-MM-dd'), description: 'Grocery Shopping', amount: -3500, type: 'expense', category: 'Food & Dining' },
  { id: generateId(), date: format(subDays(new Date(), 58), 'yyyy-MM-dd'), description: 'Freelance Design Work', amount: 15000, type: 'income', category: 'Freelance' },
  { id: generateId(), date: format(subDays(new Date(), 60), 'yyyy-MM-dd'), description: 'Ola / Uber rides', amount: -1800, type: 'expense', category: 'Transport' },
  { id: generateId(), date: format(subDays(new Date(), 62), 'yyyy-MM-dd'), description: 'Mutual Fund SIP', amount: -5000, type: 'expense', category: 'Investment' },
];

// Generate last-6-months balance trend data
export function generateBalanceTrend(transactions) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: format(d, 'MMM'), month: d.getMonth(), year: d.getFullYear() });
  }

  let running = 50000; // initial balance
  return months.map(({ label, month, year }) => {
    const monthTxns = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const net = monthTxns.reduce((s, t) => s + t.amount, 0);
    running += net;
    const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = Math.abs(monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
    return { month: label, balance: Math.max(0, running), income, expenses };
  });
}

export function getCategoryBreakdown(transactions) {
  const expenseMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseMap[t.category] = (expenseMap[t.category] || 0) + Math.abs(t.amount);
  });
  return Object.entries(expenseMap)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#8fa3bf' }))
    .sort((a, b) => b.value - a.value);
}
