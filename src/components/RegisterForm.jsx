import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setAuthError('');
    if (Object.keys(e).length > 0) return;

    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (result.ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setAuthError(result.error);
    }
  };

  const update = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div>
      <h1>Create an account</h1>
      <p className="subtitle">Fill in your details to get started</p>

      {authError && <div className="error-banner">{authError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={update('name')}
            className={errors.name ? 'error' : ''}
            placeholder="Jane Doe"
          />
          {errors.name && <div className="error-msg">{errors.name}</div>}
        </div>
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
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            className={errors.password ? 'error' : ''}
            placeholder="At least 6 characters"
          />
          {errors.password && <div className="error-msg">{errors.password}</div>}
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input
            type="password"
            value={form.confirm}
            onChange={update('confirm')}
            className={errors.confirm ? 'error' : ''}
            placeholder="Re-enter your password"
          />
          {errors.confirm && <div className="error-msg">{errors.confirm}</div>}
        </div>
        <button type="submit" className="submit">Create account</button>
      </form>
      <div className="footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
