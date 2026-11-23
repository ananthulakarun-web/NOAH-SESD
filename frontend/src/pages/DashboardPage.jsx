import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  FileText,
  BarChart3,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { analysisApi, resumeApi } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [histRes, resRes] = await Promise.all([
        analysisApi.getHistory(),
        resumeApi.getResumes(),
      ]);

      if (histRes.success) setHistory(histRes.data || []);
      if (resRes.success) setResumes(resRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;

    setDeletingId(id);
    try {
      const res = await analysisApi.deleteAnalysis(id);
      if (res.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert(`Error deleting analysis: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // KPIs
  const totalAnalyses = history.length;
  const avgScore =
    totalAnalyses > 0
      ? Math.round(history.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalAnalyses)
      : 0;
  const bestScore =
    totalAnalyses > 0
      ? Math.max(...history.map((h) => h.matchScore || 0))
      : 0;

  // Chart data: prepare chronological score history
  const chartData = [...history]
    .reverse()
    .slice(-7)
    .map((item, index) => ({
      index: index + 1,
      name: item.jobTitle ? (item.jobTitle.length > 15 ? item.jobTitle.slice(0, 15) + '...' : item.jobTitle) : `Scan #${index + 1}`,
      score: item.matchScore,
      date: new Date(item.analysisDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Candidate Intelligence Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="gradient-text">{user?.username || 'Engineer'}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your ATS compatibility trends, review missing skills, and run new diagnostic scans.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white gradient-bg shadow-md hover:shadow-indigo-500/20 hover:brightness-105 active:scale-95 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            New AI Scan
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Scans
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalAnalyses}</div>
          <p className="text-[11px] text-slate-400">Resumes analyzed in database</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg ATS Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {avgScore > 0 ? `${avgScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">Across all target jobs</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Best Match Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {bestScore > 0 ? `${bestScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-400">Highest compatibility achieved</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stored Resumes
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{resumes.length}</div>
          <p className="text-[11px] text-slate-400">PDF & Word versions on file</p>
        </div>
      </div>

      {/* Main Grid: Chart & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column (2 Cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Match Score Progression
              </h2>
              <p className="text-xs text-slate-400">
                Historical ATS score evolution across your recent applications
              </p>
            </div>
            {history.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Last {chartData.length} Scans
              </span>
            )}
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    itemStyle={{ color: '#c4b5fd' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl">
              <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Analysis History Yet</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                Upload your resume and paste a job specification to generate your first ATS diagnostic trend.
              </p>
              <Link
                to="/analyze"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-bg shadow-sm"
              >
                Run First Analysis
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Actions Widget (1 Col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recommended Actions</h2>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <Target className="w-3.5 h-3.5 text-purple-600" />
                Target 80%+ Compatibility
              </div>
              <p className="text-purple-800/80 leading-relaxed">
                Resumes scoring above 80% typically see a 3x higher interview callback rate by bypassing auto-rejection gates.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Incorporate Missing Synonyms
              </div>
              <p className="text-slate-600 leading-relaxed">
                Check the "Missing Skills" section in your scan results before every job application.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Use Standard Bullet Verbs
              </div>
              <p className="text-slate-600 leading-relaxed">
                Begin every achievement bullet with strong action verbs like "Spearheaded", "Engineered", and "Optimized".
              </p>
            </div>
          </div>

          <Link
            to="/analyze"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            Start New Job Analysis <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Analyses</h2>
            <p className="text-xs text-slate-400">
              Previously processed job compatibility records stored in MongoDB
            </p>
          </div>
          {history.length > 0 && (
            <Link
              to="/history"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              View Full History ({history.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Loading analyses from database...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">No Saved Analyses Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run your first scan to see matched skills, missing keywords, and ATS grades.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-bg shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Analyze Resume Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3">Job Title & Target Company</th>
                  <th className="pb-3">Resume Document</th>
                  <th className="pb-3">Scan Date</th>
                  <th className="pb-3">ATS Match</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.slice(0, 5).map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => navigate(`/analysis/${item._id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 font-semibold text-slate-800">
                      <div>{item.jobTitle}</div>
                      <div className="text-xs font-normal text-slate-400">
                        {item.companyName || 'Not specified'}
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        {item.resumeFileName}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-slate-500">
                      {new Date(item.analysisDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm ${
                            item.matchScore >= 80
                              ? 'text-emerald-600'
                              : item.matchScore >= 60
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {item.matchScore}%
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.atsGrade || 'B'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/analysis/${item._id}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="View Detailed Results"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteAnalysis(item._id, e)}
                        disabled={deletingId === item._id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Analysis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
