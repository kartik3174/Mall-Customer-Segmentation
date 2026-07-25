import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, KeyRound, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  setActiveTab: (tab: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setActiveTab }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@mall.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      setActiveTab('dashboard');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setLoading(true);
    const ok = await login(demoEmail, 'demo123');
    setLoading(false);
    if (ok) {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to access Mall Customer Analytics & Clustering Models
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@mall.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <LogIn className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Quick Demo Login
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleDemoLogin('admin@mall.com')}
            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors text-left"
          >
            Admin Account
            <span className="block text-[10px] text-slate-400 font-normal">admin@mall.com</span>
          </button>
          <button
            onClick={() => handleDemoLogin('analyst@mall.com')}
            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors text-left"
          >
            Data Analyst
            <span className="block text-[10px] text-slate-400 font-normal">analyst@mall.com</span>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <button
          onClick={() => setActiveTab('register')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register Here
        </button>
      </div>
    </div>
  );
};
