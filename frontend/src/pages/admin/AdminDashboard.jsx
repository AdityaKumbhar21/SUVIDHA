import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, ExternalLink, Loader } from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Fetch complaints on mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.listComplaints();
      if (response.data.success) {
        setComplaints(response.data.data || []);
        
        // Calculate stats
        const data = response.data.data || [];
        const stats = {
          total: data.length,
          pending: data.filter(c => c.status === 'Pending').length,
          inProgress: data.filter(c => c.status === 'In Progress').length,
          resolved: data.filter(c => c.status === 'Resolved').length
        };
        setStats(stats);
      } else {
        setError(response.data.message || 'Failed to load complaints');
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await adminAPI.updateComplaintStatus(id, newStatus);
      if (response.data.success) {
        // Update local state
        setComplaints(complaints.map(c => 
          c.id === id ? { ...c, status: newStatus } : c
        ));
        
        // Recalculate stats
        const updated = complaints.map(c => 
          c.id === id ? { ...c, status: newStatus } : c
        );
        const stats = {
          total: updated.length,
          pending: updated.filter(c => c.status === 'Pending').length,
          inProgress: updated.filter(c => c.status === 'In Progress').length,
          resolved: updated.filter(c => c.status === 'Resolved').length
        };
        setStats(stats);
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'In Progress':
        return 'bg-orange-100 text-orange-600';
      case 'Resolved':
        return 'bg-green-100 text-green-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-black text-[#1e3a8a] mb-6 uppercase tracking-tight">Officer Control Panel</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <p className="text-slate-500 text-sm font-bold uppercase">Total</p>
          <p className="text-3xl font-black text-[#1e3a8a]">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <p className="text-slate-500 text-sm font-bold uppercase">Pending</p>
          <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <p className="text-slate-500 text-sm font-bold uppercase">In Progress</p>
          <p className="text-3xl font-black text-orange-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
          <p className="text-slate-500 text-sm font-bold uppercase">Resolved</p>
          <p className="text-3xl font-black text-green-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader size={32} className="animate-spin text-[#1e3a8a]" />
          <span className="ml-4 text-slate-600 font-bold">Loading complaints...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-600 font-bold">{error}</p>
        </div>
      )}

      {/* Complaints Table */}
      {!loading && complaints.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1e3a8a] text-white">
              <tr>
                <th className="p-4 text-xs font-bold uppercase">ID</th>
                <th className="p-4 text-xs font-bold uppercase">Department</th>
                <th className="p-4 text-xs font-bold uppercase">Citizen</th>
                <th className="p-4 text-xs font-bold uppercase">Status</th>
                <th className="p-4 text-xs font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">{c.id}</td>
                  <td className="p-4 text-sm">{c.department || 'N/A'}</td>
                  <td className="p-4 text-sm font-medium">{c.citizenName || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="text-xs font-bold border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && complaints.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
          <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 font-bold">No complaints found</p>
          <p className="text-slate-400 text-sm">All systems operational</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;