import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  DollarSign
} from 'lucide-react';
import { Customer } from '../types';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export const Customers: React.FC = () => {
  const { addToast } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [clusterFilter, setClusterFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    gender: 'Female',
    age: 30,
    annualIncome: 50,
    spendingScore: 50
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const url = `/api/customers?search=${encodeURIComponent(search)}&gender=${genderFilter}&clusterId=${clusterFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch {
      // Error fetching customers
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, genderFilter, clusterFilter]);

  // Handle Add Customer
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        addToast({ type: 'success', title: 'Customer Added', message: `Customer ${data.customer.customerId} added and segmented!` });
        setIsAddModalOpen(false);
        fetchCustomers();
      } else {
        addToast({ type: 'error', title: 'Error', message: data.error });
      }
    } catch {
      addToast({ type: 'error', title: 'Submission Error', message: 'Failed to add customer' });
    }
  };

  // Handle Edit Customer
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        addToast({ type: 'success', title: 'Customer Updated', message: `Customer ${selectedCustomer.customerId} updated!` });
        setIsEditModalOpen(false);
        fetchCustomers();
      } else {
        addToast({ type: 'error', title: 'Error', message: data.error });
      }
    } catch {
      addToast({ type: 'error', title: 'Submission Error', message: 'Failed to update customer' });
    }
  };

  // Handle Delete Customer
  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Are you sure you want to delete customer ${customer.customerId}?`)) return;
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        addToast({ type: 'success', title: 'Customer Deleted', message: `Customer ${customer.customerId} removed.` });
        fetchCustomers();
      } else {
        addToast({ type: 'error', title: 'Error', message: data.error });
      }
    } catch {
      addToast({ type: 'error', title: 'Delete Error', message: 'Failed to delete customer' });
    }
  };

  // Open Edit Modal
  const openEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      gender: customer.gender,
      age: customer.age,
      annualIncome: customer.annualIncome,
      spendingScore: customer.spendingScore
    });
    setIsEditModalOpen(true);
  };

  // Open Profile Modal
  const openProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsProfileModalOpen(true);
  };

  // Pagination Math
  const totalPages = Math.ceil(customers.length / itemsPerPage) || 1;
  const paginatedCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Customer Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View, search, filter, add, edit, and delete mall customer records
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ gender: 'Female', age: 30, annualIncome: 50, spendingScore: 50 });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 text-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search ID, Segment, Gender..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          <select
            value={genderFilter}
            onChange={e => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={clusterFilter}
            onChange={e => {
              setClusterFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Segments</option>
            <option value="0">Cluster 1</option>
            <option value="1">Cluster 2</option>
            <option value="2">Cluster 3</option>
            <option value="3">Cluster 4</option>
            <option value="4">Cluster 5</option>
          </select>

          <span className="text-xs text-slate-400 font-medium ml-auto md:ml-0">
            Total: <strong>{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Age</th>
                <th className="p-4">Annual Income</th>
                <th className="p-4">Spending Score</th>
                <th className="p-4">Assigned Segment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading customer records...</td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No matching customer records found.</td>
                </tr>
              ) : (
                paginatedCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{c.customerId}</td>
                    <td className="p-4 font-medium">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.gender.toLowerCase() === 'female'
                          ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      }`}>
                        {c.gender}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{c.age} yrs</td>
                    <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">${c.annualIncome}k</td>
                    <td className="p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, c.spendingScore)}%` }}
                          />
                        </div>
                        <span>{c.spendingScore}/100</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                        {c.segmentName || `Cluster ${(c.clusterId ?? 0) + 1}`}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => openProfile(c)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Mall Customer"
        subtitle="Insert demographic features for AI cluster assignment"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              min={18}
              max={100}
              required
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Annual Income (k$)
            </label>
            <input
              type="number"
              min={10}
              max={250}
              required
              value={formData.annualIncome}
              onChange={e => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Spending Score (1-100)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={formData.spendingScore}
              onChange={e => setFormData({ ...formData, spendingScore: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 text-xs shadow-md"
          >
            Save & Classify Customer
          </button>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Customer ${selectedCustomer?.customerId}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              min={18}
              max={100}
              required
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Annual Income (k$)
            </label>
            <input
              type="number"
              min={10}
              max={250}
              required
              value={formData.annualIncome}
              onChange={e => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Spending Score (1-100)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={formData.spendingScore}
              onChange={e => setFormData({ ...formData, spendingScore: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 text-xs shadow-md"
          >
            Update Record
          </button>
        </form>
      </Modal>

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title={`Customer Profile: ${selectedCustomer.customerId}`}
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                {selectedCustomer.gender.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedCustomer.customerId}</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Assigned Segment: {selectedCustomer.segmentName || 'Unclassified'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-slate-400 font-semibold uppercase">Age</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedCustomer.age} yrs</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-slate-400 font-semibold uppercase">Annual Income</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">${selectedCustomer.annualIncome}k</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-slate-400 font-semibold uppercase">Spending Score</span>
                <span className="text-base font-bold text-amber-500">{selectedCustomer.spendingScore}/100</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">Recommended Marketing Strategy</h5>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Based on unsupervised clustering, this customer belongs to <strong>{selectedCustomer.segmentName}</strong>. Recommended outreach includes personalized promotional offers and loyalty incentives aligned with their spending power.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
