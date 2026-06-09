import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import { useDailyStore } from '../hooks/useDailyStore.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { rows: activities } = useDailyStore('activities', []);
  const { rows: money } = useDailyStore('money', []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const filledActivities = activities.filter((a) => a.activity?.trim());
  const totalMinutes = activities.reduce(
    (s, a) => s + (Number(a.duration) || 0),
    0
  );

  const income = money
    .filter((e) => e.type === 'income')
    .reduce((s, e) => s + e.amount, 0);
  const expense = money
    .filter((e) => e.type === 'expense')
    .reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  const fmtTime = (m) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
  };

  const fmtMoney = (n) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const recentActivities = filledActivities.slice(-3).reverse();
  const recentMoney = money.slice(-3).reverse();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">
            Welcome back, {user.name || user.email} · {today}
          </p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="stat">
          <div className="stat-label">Activities today</div>
          <div className="stat-value">{filledActivities.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Time tracked</div>
          <div className="stat-value">{fmtTime(totalMinutes)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Net balance</div>
          <div
            className={
              'stat-value ' + (net >= 0 ? 'positive' : 'negative')
            }
          >
            {fmtMoney(net)}
          </div>
        </div>
      </div>

      <div className="dash-panels">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent activities</h2>
              <p className="panel-sub">Your latest entries today</p>
            </div>
            <Link to="/activities" className="btn-link">View all →</Link>
          </div>
          {recentActivities.length === 0 ? (
            <div className="empty">
              No activities logged yet today.{' '}
              <Link to="/activities">Add some →</Link>
            </div>
          ) : (
            <ul className="preview-list">
              {recentActivities.map((a) => (
                <li key={a.id}>
                  <div>
                    <div className="preview-title">{a.activity}</div>
                    <div className="preview-meta">
                      {a.time || 'No time'}
                      {a.duration ? ` · ${a.duration} min` : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent transactions</h2>
              <p className="panel-sub">Today's income &amp; expenses</p>
            </div>
            <Link to="/money" className="btn-link">View all →</Link>
          </div>
          {recentMoney.length === 0 ? (
            <div className="empty">
              No transactions yet today.{' '}
              <Link to="/money">Add some →</Link>
            </div>
          ) : (
            <ul className="preview-list">
              {recentMoney.map((e) => (
                <li key={e.id}>
                  <div>
                    <div className="preview-title">{e.description}</div>
                    <div className="preview-meta">{e.category}</div>
                  </div>
                  <div className={'preview-amount ' + e.type}>
                    {e.type === 'expense' ? '−' : '+'}
                    {fmtMoney(e.amount)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
