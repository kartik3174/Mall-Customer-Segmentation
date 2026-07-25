import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Shield, Calendar, Key, Moon, Sun, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, darkMode, setDarkMode } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-500">
        Please sign in to view profile details.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{user.name}</h2>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> Email Address
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Account Status
            </span>
            <span className="font-bold text-emerald-600">Active (JWT Verified)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Member Since
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            Toggle Appearance
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
