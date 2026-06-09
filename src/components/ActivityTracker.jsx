import { useDailyStore } from '../hooks/useDailyStore.js';

const BLANK = { time: '', activity: '', duration: '', notes: '' };

export default function ActivityTracker() {
  const { rows, add, update, remove } = useDailyStore('activities', [
    { id: crypto.randomUUID(), ...BLANK },
  ]);

  const addRow = () => add({ ...BLANK });

  const deleteRow = (id) => {
    if (rows.length <= 1) {
      update(id, { ...BLANK });
    } else {
      remove(id);
    }
  };

  const totalMinutes = rows.reduce(
    (sum, r) => sum + (Number(r.duration) || 0),
    0
  );
  const filledCount = rows.filter((r) => r.activity.trim()).length;

  const fmtTotal = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Activity Tracker</h1>
          <p className="subtitle">Log what you did today — like an Excel sheet</p>
        </div>
        <button className="btn-primary" onClick={addRow}>+ Add row</button>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table className="sheet">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Time</th>
                <th>Activity</th>
                <th style={{ width: '110px' }}>Duration (min)</th>
                <th>Notes</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <input
                      type="time"
                      value={r.time}
                      onChange={(e) => update(r.id, { time: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="e.g. Team standup"
                      value={r.activity}
                      onChange={(e) => update(r.id, { activity: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={r.duration}
                      onChange={(e) => update(r.id, { duration: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Optional notes"
                      value={r.notes}
                      onChange={(e) => update(r.id, { notes: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      className="row-delete"
                      onClick={() => deleteRow(r.id)}
                      title="Delete row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"><strong>{filledCount} activities</strong></td>
                <td><strong>{fmtTotal(totalMinutes)}</strong></td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
