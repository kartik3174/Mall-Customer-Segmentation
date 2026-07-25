import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  setActiveTab: (tab: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ setActiveTab }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-2xl">
        404
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Page Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        The requested segment analysis view or endpoint could not be located.
      </p>
      <button
        onClick={() => setActiveTab('dashboard')}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 text-xs shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </button>
    </div>
  );
};
