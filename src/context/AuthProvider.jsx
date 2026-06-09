import { createContext, useCallback, useContext, useState } from 'react';
import * as auth from '../auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.getSession());

  const login = useCallback((email, password) => {
    const result = auth.login(email, password);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const register = useCallback(({ name, email, password }) => {
    const result = auth.register({ name, email, password });
    if (!result.ok) return result;
    const loginResult = auth.login(email, password);
    if (loginResult.ok) setUser(loginResult.user);
    return loginResult;
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const resetPassword = useCallback(
    (email, newPassword) => auth.resetPassword(email, newPassword),
    []
  );

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
