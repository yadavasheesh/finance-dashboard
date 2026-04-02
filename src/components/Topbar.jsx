import { Menu, Sun, Moon, Bell, ChevronDown, Shield, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Topbar.css';

const PAGE_TITLES = {
  dashboard:    { title: 'Dashboard',    subtitle: 'Your financial overview at a glance' },
  transactions: { title: 'Transactions', subtitle: 'Manage and track all your transactions' },
  insights:     { title: 'Insights',     subtitle: 'Understand your spending patterns' },
};

export default function Topbar() {
  const { state, dispatch } = useApp();
  const { activePage, role, theme } = state;
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  const toggleTheme = () =>
    dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' });

  const handleRole = (e) =>
    dispatch({ type: 'SET_ROLE', payload: e.target.value });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="btn btn-ghost btn-icon mobile-menu-btn"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title-wrap">
          <h1 className="topbar-title">{title}</h1>
          <p className="topbar-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Role switcher */}
        <div className="role-selector">
          <div className="role-icon">
            {role === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
          </div>
          <select className="role-select" value={role} onChange={handleRole}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <ChevronDown size={13} className="role-chevron" />
        </div>

        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-icon topbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification (decorative) */}
        <button className="btn btn-ghost btn-icon topbar-icon-btn notif-btn" title="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {/* Avatar */}
        <div className="avatar" title={role === 'admin' ? 'Admin User' : 'Viewer User'}>
          {role === 'admin' ? 'A' : 'V'}
        </div>
      </div>
    </header>
  );
}
