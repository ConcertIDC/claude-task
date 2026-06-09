import { useState } from 'react';
import { useDailyStore } from '../hooks/useDailyStore.js';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Salary', 'Other'];

export default function MoneyCalculator() {
  const { rows: entries, add, remove } = useDailyStore('money', []);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
  });

  const handleAdd = (ev) => {
    ev.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.description.trim() || isNaN(amt) || amt <= 0) return;
    add({
      description: form.description.trim(),
      amount: amt,
      type: form.type,
      category: form.category,
    });
    setForm({ ...form, description: '', amount: '' });
  };

  const income = entries
    .filter((e) => e.type === 'income')
    .reduce((s, e) => s + e.amount, 0);
  const expense = entries
    .filter((e) => e.type === 'expense')
    .reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  const fmt = (n) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Money Calculator</h1>
          <p className="subtitle">Track today's income and expenses</p>
        </div>
      </div>

      <div className="panel">
        <div className="money-totals">
          <div className="money-total income">
            <div className="mt-label">Income</div>
            <div className="mt-value">{fmt(income)}</div>
          </div>
          <div className="money-total expense">
            <div className="mt-label">Expense</div>
            <div className="mt-value">{fmt(expense)}</div>
          </div>
          <div
            className={
              'money-total net ' + (net >= 0 ? 'positive' : 'negative')
            }
          >
            <div className="mt-label">Net balance</div>
            <div className="mt-value">{fmt(net)}</div>
          </div>
        </div>

        <form className="money-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="btn-primary">Add</button>
        </form>

        {entries.length === 0 ? (
          <div className="empty">No entries yet — add your first above.</div>
        ) : (
          <ul className="money-list">
            {entries.map((e) => (
              <li key={e.id} className={'money-item ' + e.type}>
                <div className="mi-main">
                  <span className="mi-desc">{e.description}</span>
                  <span className="mi-cat">{e.category}</span>
                </div>
                <div className="mi-right">
                  <span className="mi-amount">
                    {e.type === 'expense' ? '−' : '+'}{fmt(e.amount)}
                  </span>
                  <button
                    className="row-delete"
                    onClick={() => remove(e.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
