import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="card">
        <Outlet />
      </div>
    </div>
  );
}
