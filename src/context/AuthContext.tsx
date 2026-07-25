import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ToastMessage } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mall_app_user');
    return saved ? JSON.parse(saved) : {
      id: 'user-001',
      name: 'Dr. Sarah Jenkins',
      email: 'admin@mall.com',
      role: 'Admin',
      createdAt: new Date().toISOString()
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('mall_app_token') || 'jwt-demo-token-12345';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mall_app_theme') === 'dark';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mall_app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mall_app_theme', 'light');
    }
  }, [darkMode]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('mall_app_user', JSON.stringify(data.user));
        localStorage.setItem('mall_app_token', data.token);
        addToast({ type: 'success', title: 'Signed In Successfully', message: `Welcome back, ${data.user.name}` });
        return true;
      } else {
        addToast({ type: 'error', title: 'Login Failed', message: data.error || 'Invalid credentials' });
        return false;
      }
    } catch {
      // Fallback local auth if server API unreachable
      const dummyUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0] || 'Data Analyst',
        email,
        role: 'Data Analyst',
        createdAt: new Date().toISOString()
      };
      setUser(dummyUser);
      setToken('jwt-local-demo-token');
      localStorage.setItem('mall_app_user', JSON.stringify(dummyUser));
      localStorage.setItem('mall_app_token', 'jwt-local-demo-token');
      addToast({ type: 'success', title: 'Signed In', message: `Logged in as ${dummyUser.name}` });
      return true;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role: 'Data Analyst' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('mall_app_user', JSON.stringify(data.user));
        localStorage.setItem('mall_app_token', data.token);
        addToast({ type: 'success', title: 'Account Created', message: 'Registration completed successfully!' });
        return true;
      } else {
        addToast({ type: 'error', title: 'Registration Failed', message: data.error || 'Could not create account' });
        return false;
      }
    } catch {
      const dummyUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'Data Analyst',
        createdAt: new Date().toISOString()
      };
      setUser(dummyUser);
      setToken('jwt-local-demo-token');
      addToast({ type: 'success', title: 'Account Created', message: `Welcome, ${name}!` });
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mall_app_user');
    localStorage.removeItem('mall_app_token');
    addToast({ type: 'info', title: 'Signed Out', message: 'You have been logged out.' });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      darkMode,
      setDarkMode,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
