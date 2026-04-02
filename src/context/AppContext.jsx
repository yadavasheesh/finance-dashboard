import { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'finflow_state';

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const defaultState = {
  transactions: INITIAL_TRANSACTIONS,
  role: 'admin',       // 'admin' | 'viewer'
  theme: 'dark',       // 'dark' | 'light'
  activePage: 'dashboard',
  sidebarOpen: false,
  filters: {
    search: '',
    type: 'all',       // 'all' | 'income' | 'expense'
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',    // 'date' | 'amount' | 'category'
    sortDir: 'desc',   // 'asc' | 'desc'
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_PAGE':
      return { ...state, activePage: action.payload, sidebarOpen: false };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: defaultState.filters };

    case 'ADD_TRANSACTION': {
      const t = { ...action.payload, id: generateId() };
      return { ...state, transactions: [t, ...state.transactions] };
    }

    case 'EDIT_TRANSACTION': {
      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    }

    case 'HYDRATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch (e) {}
    return init;
  });

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Selector hooks
export function useFilteredTransactions() {
  const { state } = useApp();
  const { transactions, filters } = state;
  const { search, type, category, dateFrom, dateTo, sortBy, sortDir } = filters;

  let result = [...transactions];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  if (type !== 'all') result = result.filter(t => t.type === type);
  if (category !== 'all') result = result.filter(t => t.category === category);
  if (dateFrom) result = result.filter(t => t.date >= dateFrom);
  if (dateTo)   result = result.filter(t => t.date <= dateTo);

  result.sort((a, b) => {
    let va, vb;
    if (sortBy === 'date')     { va = a.date; vb = b.date; }
    else if (sortBy === 'amount') { va = Math.abs(a.amount); vb = Math.abs(b.amount); }
    else { va = a.category; vb = b.category; }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return result;
}

export function useSummary() {
  const { state: { transactions } } = useApp();

  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });

  const totalIncome  = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalBalance = transactions.reduce((s, t) => s + t.amount, 0) + 50000; // +50k initial

  const lastIncome  = lastMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastExpense = lastMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : '0.0';

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    savings,
    savingsRate,
    lastIncome,
    lastExpense,
    incomeChange: lastIncome > 0 ? (((totalIncome - lastIncome) / lastIncome) * 100).toFixed(1) : null,
    expenseChange: lastExpense > 0 ? (((totalExpense - lastExpense) / lastExpense) * 100).toFixed(1) : null,
  };
}
