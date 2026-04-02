import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCategoryBreakdown, generateBalanceTrend, CATEGORY_COLORS } from '../data/mockData';
import { format, startOfMonth, subMonths, getMonth, getYear } from 'date-fns';
import './Insights.css';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function InsightCard({ icon: Icon, title, value, sub, color, type = 'neutral', delay = 0 }) {
  const colors = {
    positive: { bg: 'rgba(62,217,192,0.08)', border: 'rgba(62,217,192,0.2)', icon: 'var(--income-color)' },
    negative: { bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.2)', icon: 'var(--expense-color)' },
    warning:  { bg: 'rgba(245,200,66,0.08)',  border: 'rgba(245,200,66,0.2)',  icon: 'var(--accent-gold)' },
    neutral:  { bg: 'rgba(91,141,238,0.08)',  border: 'rgba(91,141,238,0.2)',  icon: 'var(--accent-blue)' },
  };
  const c = colors[type];
  return (
    <div
      className="insight-card animate-in"
      style={{ background: c.bg, border: `1px solid ${c.border}`, animationDelay: `${delay}ms` }}
    >
      <div className="insight-icon" style={{ color: c.icon }}>
        <Icon size={22} />
      </div>
      <div className="insight-body">
        <div className="insight-title">{title}</div>
        <div className="insight-value">{value}</div>
        {sub && <div className="insight-sub">{sub}</div>}
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

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  // Derived data
  const breakdown = getCategoryBreakdown(transactions);
  const trend = generateBalanceTrend(transactions);

  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return getMonth(d) === getMonth(now) && getYear(d) === getYear(now);
  });
  const lastMonthDate = subMonths(now, 1);
  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return getMonth(d) === getMonth(lastMonthDate) && getYear(d) === getYear(lastMonthDate);
  });

  const thisIncome  = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const thisExpense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  const lastIncome  = lastMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastExpense = lastMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);

  const savingsRate = thisIncome > 0 ? (((thisIncome - thisExpense) / thisIncome) * 100).toFixed(1) : 0;
  const top = breakdown[0];
  const expenseDelta = lastExpense > 0 ? (((thisExpense - lastExpense) / lastExpense) * 100).toFixed(1) : null;

  // Radar data
  const radarData = breakdown.slice(0, 6).map(({ name, value }) => ({
    subject: name.split(' ')[0],
    amount: value,
  }));

  // Category comparison (this vs last month)
  const categoryComparison = breakdown.slice(0, 5).map(({ name }) => {
    const thisAmt = thisMonth.filter(t => t.category === name && t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const lastAmt = lastMonth.filter(t => t.category === name && t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return { name: name.split(' ')[0], thisMonth: thisAmt, lastMonth: lastAmt };
  });

  // Observations
  const observations = [];
  if (parseFloat(savingsRate) >= 20) {
    observations.push({ type: 'positive', text: `Great! You're saving ${savingsRate}% of your income this month.` });
  } else if (parseFloat(savingsRate) > 0) {
    observations.push({ type: 'warning', text: `Your savings rate is ${savingsRate}%. Try to aim for 20%+.` });
  }
  if (top) {
    observations.push({ type: 'neutral', text: `${top.name} is your highest spending category at ${formatINR(top.value)}.` });
  }
  if (expenseDelta && parseFloat(expenseDelta) > 0) {
    observations.push({ type: 'negative', text: `Expenses up ${expenseDelta}% vs last month. Review your spending.` });
  } else if (expenseDelta && parseFloat(expenseDelta) < 0) {
    observations.push({ type: 'positive', text: `Expenses down ${Math.abs(parseFloat(expenseDelta))}% vs last month. Nice work!` });
  }

  const ObsIcon = { positive: CheckCircle, negative: AlertCircle, warning: Zap, neutral: TrendingUp };

  return (
    <div className="insights-page animate-in">
      {/* KPI cards */}
      <div className="grid-insights" style={{ marginBottom: 24 }}>
        <InsightCard
          icon={Award}
          title="Top Spending Category"
          value={top ? top.name : '—'}
          sub={top ? formatINR(top.value) + ' this month' : 'No data'}
          type="warning"
          delay={0}
        />
        <InsightCard
          icon={TrendingUp}
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub={thisIncome > 0 ? `${formatINR(thisIncome - thisExpense)} saved` : 'No income data'}
          type={parseFloat(savingsRate) >= 20 ? 'positive' : parseFloat(savingsRate) > 0 ? 'warning' : 'negative'}
          delay={80}
        />
        <InsightCard
          icon={expenseDelta && parseFloat(expenseDelta) > 0 ? TrendingUp : TrendingDown}
          title="Expense vs Last Month"
          value={expenseDelta ? `${expenseDelta > 0 ? '+' : ''}${expenseDelta}%` : 'N/A'}
          sub={`This: ${formatINR(thisExpense)} | Last: ${formatINR(lastExpense)}`}
          type={expenseDelta && parseFloat(expenseDelta) > 0 ? 'negative' : 'positive'}
          delay={160}
        />
      </div>

      {/* Charts */}
      <div className="grid-charts" style={{ marginBottom: 24 }}>
        {/* Category bar comparison */}
        <div className="card animate-in" style={{ animationDelay: '220ms' }}>
          <div className="card-header-insight">
            <h3 className="heading-md">Month-over-Month Comparison</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {format(lastMonthDate, 'MMMM')} vs {format(now, 'MMMM')} — by category
            </p>
          </div>
          {categoryComparison.every(c => c.thisMonth === 0 && c.lastMonth === 0) ? (
            <div className="empty-state"><p>Not enough data for comparison</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryComparison} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
                <Bar dataKey="lastMonth" name={format(lastMonthDate, 'MMM')} fill="var(--text-muted)" radius={[4,4,0,0]} opacity={0.5} />
                <Bar dataKey="thisMonth" name={format(now, 'MMM')} fill="var(--accent-teal)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Radar chart */}
        <div className="card animate-in" style={{ animationDelay: '280ms' }}>
          <div className="card-header-insight">
            <h3 className="heading-md">Spending Pattern</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Category distribution</p>
          </div>
          {radarData.length === 0 ? (
            <div className="empty-state"><p>No expense data</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Radar name="Spending" dataKey="amount" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI-like Observations + Category breakdown table */}
      <div className="grid-2">
        {/* Observations */}
        <div className="card animate-in" style={{ animationDelay: '340ms' }}>
          <h3 className="heading-md" style={{ marginBottom: 16 }}>Smart Observations</h3>
          {observations.length === 0 ? (
            <div className="empty-state"><p>Add more transactions to see insights</p></div>
          ) : (
            <div className="observations-list">
              {observations.map((obs, i) => {
                const Icon = ObsIcon[obs.type];
                const colors = {
                  positive: 'var(--income-color)',
                  negative: 'var(--expense-color)',
                  warning: 'var(--accent-gold)',
                  neutral: 'var(--accent-blue)',
                };
                return (
                  <div key={i} className="obs-item" style={{ animationDelay: `${340 + i * 80}ms` }}>
                    <Icon size={18} color={colors[obs.type]} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p className="obs-text">{obs.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category breakdown table */}
        <div className="card animate-in" style={{ animationDelay: '400ms', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <h3 className="heading-md">Expense Breakdown</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No expenses recorded</td></tr>
                ) : (() => {
                  const total = breakdown.reduce((s, b) => s + b.value, 0);
                  return breakdown.slice(0, 8).map(({ name, value, color }) => (
                    <tr key={name}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                          {name}
                        </div>
                      </td>
                      <td className="amount-negative">{formatINR(value)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden', minWidth: 60 }}>
                            <div style={{ width: `${(value/total*100).toFixed(1)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: 36 }}>
                            {(value/total*100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
