import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import { DEMO_CREDENTIALS } from '../auth.js';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setAuthError('');
    if (Object.keys(e).length > 0) return;

    const result = login(form.email, form.password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error);
    }
  };

  const update = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  const fillDemo = () => {
    setForm({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    setErrors({});
    setAuthError('');
  };

  return (
    <div>
      <h1>Welcome back</h1>
      <p className="subtitle">Sign in to your account to continue</p>

      <div className="demo-banner">
        <div>
          <strong>Demo credentials</strong>
          <div className="demo-creds">
            {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </div>
        </div>
        <button type="button" className="demo-fill" onClick={fillDemo}>
          Fill
        </button>
      </div>

      {authError && <div className="error-banner">{authError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            className={errors.email ? 'error' : ''}
            placeholder="you@example.com"
          />
          {errors.email && <div className="error-msg">{errors.email}</div>}
        </div>
        <div className="field">
          <div className="label-row">
            <label>Password</label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            className={errors.password ? 'error' : ''}
            placeholder="Enter your password"
          />
          {errors.password && <div className="error-msg">{errors.password}</div>}
        </div>
        <button type="submit" className="submit">Sign in</button>
      </form>
      <div className="footer">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
