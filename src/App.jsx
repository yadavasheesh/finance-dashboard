import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';

function PageContent() {
  const { state } = useApp();
  switch (state.activePage) {
    case 'dashboard':    return <Dashboard />;
    case 'transactions': return <Transactions />;
    case 'insights':     return <Insights />;
    default:             return <Dashboard />;
  }
}

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-body">
          <PageContent />
        </main>
      </div>
    </div>
  );
}
