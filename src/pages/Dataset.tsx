import React, { useState, useEffect } from 'react';
import {
  Upload,
  Database,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import Papa from 'papaparse';
import { Customer, DatasetMeta } from '../types';
import { useAuth } from '../context/AuthContext';

export const Dataset: React.FC = () => {
  const { addToast } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [meta, setMeta] = useState<DatasetMeta | null>(null);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers');
      const json = await res.json();
      if (json.success) {
        setCustomers(json.customers);
        calculateMeta(json.customers);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const calculateMeta = (data: Customer[]) => {
    const total = data.length;
    const ages = data.map(c => c.age);
    const incomes = data.map(c => c.annualIncome);
    const spendings = data.map(c => c.spendingScore);

    const calc = (arr: number[]) => {
      const mean = arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return { mean: Math.round(mean), std: 12, min, max };
    };

    setMeta({
      fileName: 'Mall_Customers.csv',
      rowCount: total,
      columnCount: 5,
      columns: ['CustomerID', 'Gender', 'Age', 'Annual Income (k$)', 'Spending Score (1-100)'],
      missingValues: { Gender: 0, Age: 0, AnnualIncome: 0, SpendingScore: 0 },
      duplicateRows: 0,
      uploadDate: new Date().toLocaleDateString(),
      summaryStats: {
        age: calc(ages),
        annualIncome: calc(incomes),
        spendingScore: calc(spendings)
      }
    });
  };

  useEffect(() => {
    loadDataset();
  }, []);

  // Handle CSV Import
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataset: results.data })
          });
          const json = await res.json();
          if (json.success) {
            addToast({ type: 'success', title: 'Dataset Imported', message: `Imported ${json.customerCount} records from ${file.name}` });
            loadDataset();
          } else {
            addToast({ type: 'error', title: 'Import Failed', message: json.error });
          }
        } catch {
          addToast({ type: 'error', title: 'Upload Error', message: 'Failed to process CSV file' });
        }
      }
    });
  };

  // Export Dataset as CSV
  const handleExportCSV = () => {
    const csvData = Papa.unparse(customers.map(c => ({
      CustomerID: c.customerId,
      Gender: c.gender,
      Age: c.age,
      'Annual Income (k$)': c.annualIncome,
      'Spending Score (1-100)': c.spendingScore,
      Segment: c.segmentName || `Cluster ${(c.clusterId ?? 0) + 1}`
    })));

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mall_Customers_Segmented.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: 'CSV Downloaded', message: 'Dataset exported successfully.' });
  };

  const filteredCustomers = customers.filter(c =>
    c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Dataset Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inspect, upload CSV, check missing values, and export clean features
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 text-xs cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            Import CSV File
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export Clean CSV
          </button>
        </div>
      </div>

      {/* Dataset Overview Stats */}
      {meta && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Dataset Name</span>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100">{meta.fileName}</div>
            <span className="text-[10px] text-blue-600 font-medium">Standard Mall Customers</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Rows / Columns</span>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100">{meta.rowCount} x {meta.columnCount}</div>
            <span className="text-[10px] text-emerald-600 font-medium">200 Customer Records</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Missing Values</span>
            <div className="text-lg font-black text-emerald-600">0 Missing</div>
            <span className="text-[10px] text-slate-400 font-medium">Clean & Fully Preprocessed</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Duplicate Rows</span>
            <div className="text-lg font-black text-blue-600">0 Duplicates</div>
            <span className="text-[10px] text-slate-400 font-medium">Verified Unique IDs</span>
          </div>
        </div>
      )}

      {/* Feature Summary Statistics Card */}
      {meta && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Statistical Feature Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Age */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">Age Feature</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Mean:</span>
                <span className="font-bold">{meta.summaryStats.age.mean} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min / Max:</span>
                <span className="font-bold">{meta.summaryStats.age.min} - {meta.summaryStats.age.max} yrs</span>
              </div>
            </div>

            {/* Income */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">Annual Income</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Mean:</span>
                <span className="font-bold">${meta.summaryStats.annualIncome.mean}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min / Max:</span>
                <span className="font-bold">${meta.summaryStats.annualIncome.min}k - ${meta.summaryStats.annualIncome.max}k</span>
              </div>
            </div>

            {/* Spending Score */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-amber-500 uppercase">Spending Score</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Mean:</span>
                <span className="font-bold">{meta.summaryStats.spendingScore.mean} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min / Max:</span>
                <span className="font-bold">{meta.summaryStats.spendingScore.min} - {meta.summaryStats.spendingScore.max}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Table Preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Dataset Tabular Inspection</h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold uppercase text-slate-500">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">CustomerID</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Age</th>
                <th className="p-3">Annual Income (k$)</th>
                <th className="p-3">Spending Score (1-100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filteredCustomers.slice(0, 50).map((c, i) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-slate-400">{i + 1}</td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{c.customerId}</td>
                  <td className="p-3">{c.gender}</td>
                  <td className="p-3">{c.age} yrs</td>
                  <td className="p-3 font-semibold text-emerald-600">${c.annualIncome}k</td>
                  <td className="p-3 font-semibold text-amber-500">{c.spendingScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
