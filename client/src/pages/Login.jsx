import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await login(email, password);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to login');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="brand brand-lg">
          <span className="brand-mark">C</span>
          <span>Creator Growth OS</span>
        </div>
        <h1>Welcome back</h1>
        <p className="muted">Post smarter. Grow faster.</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {err && <div className="error">{err}</div>}
          <button className="btn primary block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="muted center">No account? <Link to="/signup">Create one</Link></p>
      </div>
    </div>
  );
}
