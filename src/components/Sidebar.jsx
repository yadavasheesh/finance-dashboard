import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',      icon: Lightbulb },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { activePage, sidebarOpen } = state;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="var(--accent-teal)" fillOpacity="0.15"/>
              <path d="M7 14C7 10.134 10.134 7 14 7s7 3.134 7 7-3.134 7-7 7" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 11v6M11 14h6" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">FinFlow</span>
          <button
            className="sidebar-close btn btn-ghost btn-icon"
            onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
          >
            <X size={18} />
          </button>
        </div>

        <div className="divider" />

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="label" style={{ padding: '0 16px', marginBottom: 8 }}>Menu</p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: id })}
            >
              <Icon size={18} />
              <span>{label}</span>
              {activePage === id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="storage-info">
            <div className="label">Data Saved</div>
            <div className="storage-bar">
              <div className="storage-fill" style={{ width: '35%' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {state.transactions.length} transactions stored
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
