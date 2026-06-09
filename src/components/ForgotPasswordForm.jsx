import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import { emailExists } from '../auth.js';

export default function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [pwd, setPwd] = useState({ new: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate('/login'), 1800);
    return () => clearTimeout(t);
  }, [done, navigate]);

  const submitEmail = (ev) => {
    ev.preventDefault();
    if (!email) return setEmailError('Email is required');
    if (!/\S+@\S+\.\S+/.test(email)) return setEmailError('Invalid email');
    if (!emailExists(email)) {
      return setEmailError('No account found for that email');
    }
    setEmailError('');
    setStep('reset');
  };

  const submitReset = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!pwd.new) e.new = 'Password is required';
    else if (pwd.new.length < 6) e.new = 'Must be at least 6 characters';
    if (pwd.confirm !== pwd.new) e.confirm = 'Passwords do not match';
    setPwdErrors(e);
    if (Object.keys(e).length > 0) return;

    const result = resetPassword(email, pwd.new);
    if (result.ok) setDone(true);
  };

  if (done) {
    return (
      <div>
        <h1>Password reset</h1>
        <p className="subtitle">Your password has been updated</p>
        <div className="success">
          Success! Redirecting you to sign in&hellip;
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div>
        <h1>Reset your password</h1>
        <p className="subtitle">Enter the email associated with your account</p>
        <form onSubmit={submitEmail} noValidate>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={emailError ? 'error' : ''}
              placeholder="you@example.com"
            />
            {emailError && <div className="error-msg">{emailError}</div>}
          </div>
          <button type="submit" className="submit">Continue</button>
        </form>
        <div className="footer">
          Remembered it? <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Choose a new password</h1>
      <p className="subtitle">Resetting password for {email}</p>
      <form onSubmit={submitReset} noValidate>
        <div className="field">
          <label>New password</label>
          <input
            type="password"
            value={pwd.new}
            onChange={(ev) => setPwd({ ...pwd, new: ev.target.value })}
            className={pwdErrors.new ? 'error' : ''}
            placeholder="At least 6 characters"
          />
          {pwdErrors.new && <div className="error-msg">{pwdErrors.new}</div>}
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input
            type="password"
            value={pwd.confirm}
            onChange={(ev) => setPwd({ ...pwd, confirm: ev.target.value })}
            className={pwdErrors.confirm ? 'error' : ''}
            placeholder="Re-enter your new password"
          />
          {pwdErrors.confirm && (
            <div className="error-msg">{pwdErrors.confirm}</div>
          )}
        </div>
        <button type="submit" className="submit">Reset password</button>
      </form>
      <div className="footer">
        <a
          onClick={() => {
            setStep('email');
            setPwd({ new: '', confirm: '' });
            setPwdErrors({});
          }}
        >
          ← Use a different email
        </a>
      </div>
    </div>
  );
}
