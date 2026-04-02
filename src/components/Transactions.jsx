import { useState } from 'react';
import { Plus, Search, Filter, X, Edit2, Trash2, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useApp, useFilteredTransactions } from '../context/AppContext';
import { CATEGORIES, CATEGORY_ICONS } from '../data/mockData';
import TransactionModal from './TransactionModal';
import './Transactions.css';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(amount));
}

function SortIcon({ field, currentSort, dir }) {
  if (currentSort !== field) return <ChevronDown size={13} style={{ opacity: 0.3 }} />;
  return dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
}

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { role, filters } = state;
  const isAdmin = role === 'admin';
  const transactions = useFilteredTransactions();

  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  const setFilter = (key, value) =>
    dispatch({ type: 'SET_FILTER', payload: { [key]: value } });

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: field, sortDir: 'desc' } });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const handleEdit = (txn) => {
    setEditTxn(txn);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditTxn(null);
    setModalOpen(true);
  };

  const exportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = transactions.map(t =>
      `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters =
    filters.search || filters.type !== 'all' || filters.category !== 'all' ||
    filters.dateFrom || filters.dateTo;

  return (
    <div className="transactions-page animate-in">
      {/* Controls */}
      <div className="txn-controls">
        {/* Search */}
        <div className="input-group txn-search">
          <span className="input-icon"><Search size={16} /></span>
          <input
            className="input"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
          />
          {filters.search && (
            <button className="btn btn-icon" style={{ marginRight: 4 }} onClick={() => setFilter('search', '')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="txn-actions">
          <button
            className={`btn btn-ghost ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(v => !v)}
          >
            <Filter size={15} />
            Filters
            {hasActiveFilters && <span className="filter-badge" />}
          </button>

          <button className="btn btn-ghost" onClick={exportCSV} title="Export CSV">
            <Download size={15} />
            <span className="hide-sm">Export</span>
          </button>

          {isAdmin && (
            <button className="btn btn-primary" onClick={handleAdd}>
              <Plus size={15} />
              <span className="hide-sm">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card filter-panel animate-fade">
          <div className="filter-grid">
            <div>
              <label className="label">Type</label>
              <select className="select" style={{ marginTop: 6 }} value={filters.type} onChange={e => setFilter('type', e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="select" style={{ marginTop: 6 }} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date From</label>
              <input type="date" className="input" style={{ marginTop: 6 }} value={filters.dateFrom} onChange={e => setFilter('dateFrom', e.target.value)} />
            </div>
            <div>
              <label className="label">Date To</label>
              <input type="date" className="input" style={{ marginTop: 6 }} value={filters.dateTo} onChange={e => setFilter('dateTo', e.target.value)} />
            </div>
          </div>
          {hasActiveFilters && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 16 }}
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            >
              <X size={13} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Role badge for viewer */}
      {!isAdmin && (
        <div className="viewer-banner">
          👁️ You're in <strong>Viewer mode</strong> — read-only access. Switch to Admin to add or edit transactions.
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-header">
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <Search size={40} />
            <p>No transactions found</p>
            <p style={{ fontSize: '0.8rem' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('date')}>
                    Date <SortIcon field="date" currentSort={filters.sortBy} dir={filters.sortDir} />
                  </th>
                  <th>Description</th>
                  <th className="sortable" onClick={() => handleSort('category')}>
                    Category <SortIcon field="category" currentSort={filters.sortBy} dir={filters.sortDir} />
                  </th>
                  <th>Type</th>
                  <th className="sortable" onClick={() => handleSort('amount')}>
                    Amount <SortIcon field="amount" currentSort={filters.sortBy} dir={filters.sortDir} />
                  </th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr key={t.id} className="txn-row" style={{ animationDelay: `${idx * 20}ms` }}>
                    <td className="td-date">
                      {format(new Date(t.date), 'dd MMM yyyy')}
                    </td>
                    <td className="td-desc">
                      <span className="desc-text">{t.description}</span>
                    </td>
                    <td>
                      <span className="cat-chip">
                        {CATEGORY_ICONS[t.category] || '📌'} {t.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.type}`}>
                        {t.type === 'income' ? '↑' : '↓'} {t.type}
                      </span>
                    </td>
                    <td className={t.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-btns">
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => handleEdit(t)}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-icon btn-sm"
                            onClick={() => handleDelete(t.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          txn={editTxn}
          onClose={() => { setModalOpen(false); setEditTxn(null); }}
        />
      )}
    </div>
  );
}
