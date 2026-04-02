# FinFlow — Finance Dashboard

A clean, interactive finance dashboard built with **React + Vite**, featuring role-based UI, rich data visualizations, full CRUD for transactions, spending insights, dark/light mode, and localStorage persistence.

---

## 🚀 Live Preview

> Run locally with the steps below — takes under 60 seconds.

---

## ⚙️ Setup & Installation

**Prerequisites:** Node.js ≥ 18

```bash
# 1. Clone / unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📐 Project Structure

```
finance-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx / .css       # Navigation sidebar
│   │   ├── Topbar.jsx / .css        # Top bar with role switcher & theme toggle
│   │   ├── Dashboard.jsx / .css     # Overview page
│   │   ├── Transactions.jsx / .css  # Transactions table with CRUD & filters
│   │   ├── TransactionModal.jsx     # Add / Edit modal
│   │   └── Insights.jsx / .css      # Analytics & observations
│   ├── context/
│   │   └── AppContext.jsx           # Global state (useReducer + Context API)
│   ├── data/
│   │   └── mockData.js              # 40+ mock transactions + data helpers
│   ├── App.jsx                      # Root component + page routing
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global design system (CSS variables)
├── index.html
├── vite.config.js
└── package.json
```

---

## ✨ Features

### 1. Dashboard Overview
- **4 Summary Cards** — Total Balance, Monthly Income, Monthly Expenses, Net Savings  
  - Animated count-up on load  
  - Month-over-month % change indicators  
- **Balance Trend** — 6-month area chart (Recharts)  
- **Spending Breakdown** — Donut/Pie chart by category with inline legend  
- **Income vs Expenses** — Grouped bar chart per month  
- **Recent Activity** — Last 5 transactions at a glance  

### 2. Transactions Section
- Paginated table with **Date, Description, Category, Type, Amount**  
- **Search** by description or category (live filter)  
- **Filter panel** — Type (income/expense), Category, Date range  
- **Sortable columns** — Date, Amount, Category (asc/desc toggle)  
- **Export to CSV** — downloads filtered results  
- **Add / Edit / Delete** transactions (Admin only)  
- Animated row entrance on render  

### 3. Role-Based UI (RBAC Simulation)
Switch roles via the **dropdown in the top bar**:

| Feature | Admin | Viewer |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| View insights | ✅ | ✅ |

Viewer mode shows a banner explaining read-only access.

### 4. Insights Section
- **Highest spending category** card with total amount  
- **Savings rate** (%) with good/warning/bad threshold coloring  
- **Expense delta vs last month** with trend direction  
- **Month-over-Month grouped bar chart** — top 5 categories  
- **Radar/Spider chart** — spending pattern across categories  
- **Category breakdown table** with inline progress bars  
- **Smart Observations** — rule-based human-readable insights  

### 5. State Management
All state lives in a single **React Context + useReducer** store (`AppContext.jsx`):

```
State shape:
{
  transactions: Transaction[],   // all transaction data
  role: 'admin' | 'viewer',     // current user role
  theme: 'dark' | 'light',      // UI theme
  activePage: string,            // current route
  sidebarOpen: boolean,          // mobile sidebar
  filters: { search, type, category, dateFrom, dateTo, sortBy, sortDir }
}
```

Custom selector hooks (`useFilteredTransactions`, `useSummary`) derive computed data cleanly without prop drilling.

### 6. UI / UX
- **Dark mode default** with instant light mode toggle (persisted)  
- **Fully responsive** — mobile drawer sidebar, stacked grids on small screens  
- **Empty states** for all zero-data scenarios  
- **Form validation** with inline errors in the transaction modal  
- **CSS custom properties** (design tokens) for consistent theming  
- **Micro-animations** — fade-in-up cards, count-up numbers, shimmer skeletons  
- **Custom scrollbar**, polished tooltips, category chips  

### 7. Optional Enhancements (Implemented)
- ✅ **Dark / Light mode** with smooth transitions  
- ✅ **localStorage persistence** — all state survives page refresh  
- ✅ **Export to CSV** — filtered transactions  
- ✅ **Animated transitions** on all major UI elements  

---

## 🎨 Design Decisions

| Decision | Rationale |
|---|---|
| **Syne + DM Sans** | Syne's geometric boldness for headings creates contrast with DM Sans's readable body text — avoids generic Inter/Roboto |
| **Dark teal accent** (`#3ed9c0`) | Financial trust + modern SaaS feel; pairs with coral for expense indicators |
| **CSS Variables** | Single source of truth for both themes; zero-JS theme switching |
| **useReducer over Redux** | Simple enough app; avoids boilerplate while keeping predictable state mutations |
| **Recharts** | Lightweight, composable, first-class React support |
| **No router library** | Page state in Context is sufficient for 3 pages; keeps bundle lean |

---

## 📦 Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Charts | Recharts |
| Icons | Lucide React |
| Date utils | date-fns |
| Styling | Vanilla CSS with CSS Variables |
| State | React Context + useReducer |
| Persistence | localStorage |

---

## 🧪 Assumptions

- Currency is **INR (₹)** — easily changed in `formatINR()` helpers  
- "Balance" starts at ₹50,000 and accumulates from all transactions  
- Mock data covers ~3 months; extend in `src/data/mockData.js`  
- Role switching is frontend-only (no auth); suitable for demo/evaluation  

---

## 📝 Author Notes

This dashboard is intentionally scoped to showcase frontend thinking:
- **Component decomposition** — each concern has its own file  
- **Separation of data & UI** — mockData.js is pure functions, no React  
- **Accessibility** — semantic HTML, keyboard-navigable controls  
- **Performance** — derived data computed in hooks, not re-derived on every render  

Feel free to reach out for any clarifications.
