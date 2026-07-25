import React, { useRef, useState } from 'react';
import { FileText, Download, FileSpreadsheet, CheckCircle2, Sparkles, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { useAuth } from '../context/AuthContext';

export const Reports: React.FC = () => {
  const { addToast } = useAuth();
  const reportRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setGenerating(true);
      addToast({ type: 'info', title: 'Generating PDF', message: 'Rendering document canvas...' });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Mall_Customer_Segmentation_Report.pdf');
      addToast({ type: 'success', title: 'PDF Exported', message: 'Report saved as PDF file.' });
    } catch {
      addToast({ type: 'error', title: 'Export Failed', message: 'Could not generate PDF file' });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        const csv = Papa.unparse(data.customers);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Mall_Customer_Segmentation_Results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast({ type: 'success', title: 'CSV Downloaded', message: 'Exported customer records with assigned segments.' });
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to download CSV' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Export Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Executive Project Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate and export official PDF documentation and CSV datasets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/20 text-xs transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {generating ? 'Exporting PDF...' : 'Download Executive PDF'}
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Preview Document */}
      <div
        ref={reportRef}
        className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-slate-800 dark:text-slate-200"
      >
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Machine Learning Academic Project
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Mall Customer Segmentation Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Unsupervised Machine Learning & AI Behavioral Analysis
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Dataset: Mall Customers (200 Records)</p>
            <p>Author: Data Science AI Division</p>
          </div>
        </div>

        {/* Section 1: Project Objective */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            1. Executive Summary & Objective
          </h3>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            The Mall Customer Segmentation system utilizes unsupervised machine learning algorithms (K-Means, Hierarchical Agglomerative, and DBSCAN) to automatically categorize mall patrons based on demographic features, Annual Income (k$), and Spending Score (1-100).
          </p>
        </div>

        {/* Section 2: Model Performance */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            2. Machine Learning Model Benchmark
          </h3>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="block text-slate-400 font-bold">K-Means (k=5)</span>
              <span className="text-base font-black text-blue-600">Silhouette: 0.5542</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="block text-slate-400 font-bold">Hierarchical</span>
              <span className="text-base font-black text-indigo-600">Silhouette: 0.5281</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="block text-slate-400 font-bold">DBSCAN</span>
              <span className="text-base font-black text-purple-600">Silhouette: 0.4819</span>
            </div>
          </div>
        </div>

        {/* Section 3: Discovered Segments */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            3. Discovered Customer Segments
          </h3>
          <ul className="space-y-2 text-xs">
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>Cluster 1: High Income - High Spending (VIP Targets)</strong> — High purchasing power and luxury brand affinity.
            </li>
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>Cluster 2: High Income - Low Spending (Careful Savers)</strong> — Cautious buyers requiring value propositions and warranty incentives.
            </li>
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>Cluster 3: Low Income - High Spending (Careless Spenders)</strong> — Impulsive trend seekers who respond strongly to BNPL financing.
            </li>
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>Cluster 4: Low Income - Low Spending (Sensible Budgeters)</strong> — Frugal shoppers seeking steep discount vouchers.
            </li>
            <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <strong>Cluster 5: Moderate Income - Moderate Spending (Standard)</strong> — Mainstream mall shoppers targeted with standard loyalty perks.
            </li>
          </ul>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
          Generated automatically by Mall Customer AI Segmentation Engine • Confidential Academic & Business Report
        </div>
      </div>
    </div>
  );
};
