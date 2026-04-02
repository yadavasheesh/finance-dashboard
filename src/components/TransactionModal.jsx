import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const EMPTY_FORM = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food & Dining',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export default function TransactionModal({ txn, onClose }) {
  const { dispatch } = useApp();
  const isEdit = Boolean(txn);

  const [form, setForm] = useState(
    isEdit
      ? { ...txn, amount: Math.abs(txn.amount).toString() }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const rawAmount = parseFloat(form.amount);
    const amount = form.type === 'expense' ? -rawAmount : rawAmount;

    if (isEdit) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: { ...form, amount, id: txn.id } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...form, amount } });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="heading-md">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Type toggle */}
        <div className="tabs" style={{ marginBottom: 20 }}>
          <button className={`tab ${form.type === 'expense' ? 'active' : ''}`} onClick={() => set('type', 'expense')}>
            Expense
          </button>
          <button className={`tab ${form.type === 'income' ? 'active' : ''}`} onClick={() => set('type', 'income')}>
            Income
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Description */}
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Description</label>
            <input
              className={`input ${errors.description ? 'input-error' : ''}`}
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          {/* Amount + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Amount (₹)</label>
              <input
                className={`input ${errors.amount ? 'input-error' : ''}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Category</label>
              <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Date</label>
            <input
              type="date"
              className={`input ${errors.date ? 'input-error' : ''}`}
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Check size={15} />
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>

      <style>{`
        .input-error { border-color: var(--accent-coral) !important; }
        .field-error { font-size: 0.75rem; color: var(--accent-coral); margin-top: 4px; display: block; }
      `}</style>
    </div>
  );
}
