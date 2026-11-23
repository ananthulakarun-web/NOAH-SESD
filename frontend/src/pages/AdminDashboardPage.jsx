import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Trash2,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { adminApi } from '../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getUsers(),
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to permanently delete user account "${username}" and all their resumes/analyses?`)) {
      return;
    }

    setActionLoadingId(userId);
    try {
      const res = await adminApi.deleteUser(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        // refresh dashboard metrics
        adminApi.getDashboard().then((d) => d.success && setStats(d.data));
      }
    } catch (err) {
      alert(`Delete user error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Switch role for this user to "${nextRole}"?`)) return;

    setActionLoadingId(userId);
    try {
      const res = await adminApi.updateUserRole(userId, nextRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u))
        );
      }
    } catch (err) {
      alert(`Role update error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const colors = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            Superuser Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Administration & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time MongoDB platform health, candidate volume, and user account management.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
          <p className="text-[11px] text-slate-400">Registered candidate accounts</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Analyses
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalAnalyses || 0}</div>
          <p className="text-[11px] text-slate-400">ATS diagnostic scans performed</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.activeUsers || 0}</div>
          <p className="text-[11px] text-slate-400">Users actively testing resumes</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Platform Avg Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.avgScore ? `${stats.avgScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">Peak: {stats?.highestScore || 0}% | Low: {stats?.lowestScore || 0}%</p>
        </div>
      </div>

      {/* Analytics Chart: Score Distribution */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Candidate Score Distribution</h2>
            <p className="text-xs text-slate-400">Aggregated match score tiers across all user applications</p>
          </div>
          <div className="text-xs font-mono font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            MongoDB $bucket Aggregation
          </div>
        </div>

        {stats?.scoreDistribution && stats.scoreDistribution.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.scoreDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {stats.scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No score distribution data available.</p>
        )}
      </div>

      {/* User Management Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registered User Accounts</h2>
            <p className="text-xs text-slate-400">
              Manage permissions, inspect candidate usage, and delete inappropriate profiles
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter users by name/email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Resumes</th>
                <th className="pb-3">Analyses</th>
                <th className="pb-3">Registered Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-800 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {u.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{u.username}</span>
                  </td>
                  <td className="py-3.5 text-slate-600">{u.email}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-slate-700">{u.resumeCount || 0}</td>
                  <td className="py-3.5 font-semibold text-slate-700">{u.analysisCount || 0}</td>
                  <td className="py-3.5 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleToggleRole(u._id, u.role)}
                      disabled={actionLoadingId === u._id}
                      className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-purple-50 hover:text-purple-700 text-slate-600 font-medium transition-colors"
                      title="Toggle between User and Admin"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id, u.username)}
                      disabled={actionLoadingId === u._id}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
