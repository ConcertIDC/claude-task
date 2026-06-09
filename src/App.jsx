import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import RedirectIfAuthed from './components/RedirectIfAuthed.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import ForgotPasswordForm from './components/ForgotPasswordForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import ActivityTracker from './components/ActivityTracker.jsx';
import MoneyCalculator from './components/MoneyCalculator.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <LoginForm />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthed>
              <RegisterForm />
            </RedirectIfAuthed>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activities" element={<ActivityTracker />} />
        <Route path="/money" element={<MoneyCalculator />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
