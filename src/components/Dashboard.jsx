import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp, useSummary } from '../context/AppContext';
import { generateBalanceTrend, getCategoryBreakdown, CATEGORY_COLORS } from '../data/mockData';
import { format } from 'date-fns';
import './Dashboard.css';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function StatCard({ title, value, change, icon: Icon, color, delay = 0 }) {
  const [count, setCount] = useState(0);
  const positive = parseFloat(change) >= 0;

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card card animate-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: `${color}18`, color }}>
          <Icon size={20} />
        </div>
        {change !== null && change !== undefined && (
          <div className={`stat-change ${positive ? 'positive' : 'negative'}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(parseFloat(change))}%
          </div>
        )}
      </div>
      <div className="stat-value">{formatINR(count)}</div>
      <div className="stat-label">{title}</div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ background: color, width: '60%' }} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-value" style={{ color: p.color }}>
          {p.name}: {formatINR(p.value)}
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{payload[0].name}</div>
      <div className="tooltip-value">{formatINR(payload[0].value)}</div>
    </div>
  );
};

export default function Dashboard() {
  const { state } = useApp();
  const summary = useSummary();
  const trendData = generateBalanceTrend(state.transactions);
  const categoryData = getCategoryBreakdown(state.transactions);
  const top5 = categoryData.slice(0, 5);

  const recentTxns = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          title="Total Balance"
          value={summary.totalBalance}
          icon={Wallet}
          color="var(--accent-teal)"
          delay={0}
        />
        <StatCard
          title="Monthly Income"
          value={summary.totalIncome}
          change={summary.incomeChange}
          icon={TrendingUp}
          color="var(--income-color)"
          delay={80}
        />
        <StatCard
          title="Monthly Expenses"
          value={summary.totalExpense}
          change={summary.expenseChange}
          icon={TrendingDown}
          color="var(--expense-color)"
          delay={160}
        />
        <StatCard
          title="Net Savings"
          value={Math.max(0, summary.savings)}
          icon={PiggyBank}
          color="var(--accent-blue)"
          delay={240}
        />
      </div>

      {/* Charts row */}
      <div className="grid-charts" style={{ marginBottom: 24 }}>
        {/* Balance trend */}
        <div className="card animate-in" style={{ animationDelay: '300ms' }}>
          <div className="card-header">
            <div>
              <h3 className="heading-md">Balance Trend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="balance" name="Balance" stroke="var(--accent-teal)" strokeWidth={2.5} fill="url(#balGrad)" dot={{ fill: 'var(--accent-teal)', strokeWidth: 0, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending donut */}
        <div className="card animate-in" style={{ animationDelay: '360ms' }}>
          <div className="card-header">
            <div>
              <h3 className="heading-md">Spending Breakdown</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>By category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={top5}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {top5.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {top5.map(({ name, color, value }) => (
              <div key={name} className="pie-legend-item">
                <span className="pie-dot" style={{ background: color }} />
                <span className="pie-name">{name}</span>
                <span className="pie-val">{formatINR(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income vs Expense bar chart + Recent transactions */}
      <div className="grid-2" style={{ marginBottom: 0 }}>
        {/* Bar chart */}
        <div className="card animate-in" style={{ animationDelay: '420ms' }}>
          <div className="card-header">
            <h3 className="heading-md">Income vs Expenses</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
              <Bar dataKey="income" name="Income" fill="var(--income-color)" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--expense-color)" radius={[4,4,0,0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div className="card animate-in" style={{ animationDelay: '480ms' }}>
          <div className="card-header">
            <h3 className="heading-md">Recent Activity</h3>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {}}
              style={{ fontSize: '0.8rem' }}
            >
              View all →
            </button>
          </div>
          <div className="recent-list">
            {recentTxns.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet</p>
              </div>
            ) : (
              recentTxns.map(t => (
                <div key={t.id} className="recent-item">
                  <div className="recent-icon">
                    {t.type === 'income'
                      ? <TrendingUp size={15} color="var(--income-color)" />
                      : <TrendingDown size={15} color="var(--expense-color)" />}
                  </div>
                  <div className="recent-info">
                    <span className="recent-desc">{t.description}</span>
                    <span className="recent-cat">{t.category} · {format(new Date(t.date), 'dd MMM')}</span>
                  </div>
                  <div className={`recent-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatINR(Math.abs(t.amount))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
