import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await signup(name, email, password);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to sign up');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="brand brand-lg">
          <span className="brand-mark">C</span>
          <span>Creator Growth OS</span>
        </div>
        <h1>Create your account</h1>
        <p className="muted">Get AI captions, engagement predictions, and your own growth dashboard.</p>
        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {err && <div className="error">{err}</div>}
          <button className="btn primary block" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
        </form>
        <p className="muted center">Already a user? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
