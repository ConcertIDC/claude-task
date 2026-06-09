import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

export default function RedirectIfAuthed({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
