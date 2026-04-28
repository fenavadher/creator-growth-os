import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/admin/activity')
      .then((r) => setItems(r.data.items))
      .catch((e) => setErr(e.response?.data?.error || 'Failed to load'));
  }, []);

  if (err) return <div className="card center error">{err}</div>;

  return (
    <div className="admin">
      <h1>Activity log</h1>
      <p className="muted">Latest 200 user actions across the platform.</p>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>When</th><th>User</th><th>Type</th><th>Meta</th></tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a._id}>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>{a.user?.name || '—'} <span className="muted small">{a.user?.email}</span></td>
                <td><span className="pill">{a.type}</span></td>
                <td className="truncate">{JSON.stringify(a.meta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="muted center">No activity yet.</div>}
      </div>
    </div>
  );
}
