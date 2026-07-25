import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Dataset } from './pages/Dataset';
import { Segmentation } from './pages/Segmentation';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'login':
        return <Login setActiveTab={setActiveTab} />;
      case 'register':
        return <Register setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'customers':
        return <Customers />;
      case 'dataset':
        return <Dataset />;
      case 'segmentation':
        return <Segmentation />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'about':
        return <About />;
      case 'profile':
        return <Profile />;
      default:
        return <NotFound setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Mall Customer Segmentation System • Unsupervised AI & Data Science Project</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('about')} className="hover:underline">Documentation</button>
            <span>•</span>
            <button onClick={() => setActiveTab('reports')} className="hover:underline">Reports</button>
            <span>•</span>
            <button onClick={() => setActiveTab('segmentation')} className="hover:underline">ML Workbench</button>
          </div>
        </div>
      </footer>

      {/* Notification Toast System */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
