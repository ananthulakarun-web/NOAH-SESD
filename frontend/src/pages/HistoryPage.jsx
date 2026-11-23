import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Trash2,
  Sparkles,
  ArrowUpDown,
  AlertCircle,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { analysisApi } from '../services/api';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [scoreFilter, sort]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await analysisApi.getHistory({
        search: search.trim(),
        scoreFilter,
        sort,
      });
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      const res = await analysisApi.deleteAnalysis(id);
      if (res.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-purple-600" />
            Resume Archive & History
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, review, and manage your past ATS scans.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white gradient-bg shadow-sm hover:brightness-105 active:scale-95 transition-all text-sm"
        >
          <Sparkles className="w-4 h-4" />
          New ATS Analysis
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, company, or file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Score Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="all">All Scores</option>
              <option value="high">Strong Match (&gt;= 80%)</option>
              <option value="mid">Fair Match (60-79%)</option>
              <option value="low">Needs Optimization (&lt; 60%)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score_high">Highest Score</option>
              <option value="score_low">Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Grid / Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 space-y-4">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Filtering records from MongoDB...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-800">No Matching Analyses Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or score filter, or run a new scan.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-bg shadow-sm"
            >
              Run New Scan
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3">Job Title & Target Organization</th>
                  <th className="pb-3">Resume Document</th>
                  <th className="pb-3">Analyzed Date</th>
                  <th className="pb-3">ATS Score</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => navigate(`/analysis/${item._id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 font-bold text-slate-900">
                      <div>{item.jobTitle}</div>
                      <div className="text-[11px] font-normal text-slate-400 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3" />
                        {item.companyName || 'Confidential / Target Firm'}
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        {item.resumeFileName}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(item.analysisDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-3.5">
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
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                        Grade {item.atsGrade || 'B'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/analysis/${item._id}`);
                        }}
                        className="px-2.5 py-1 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors font-semibold"
                        title="View Detailed Results"
                      >
                        View Report
                      </button>
                      <button
                        onClick={(e) => handleDelete(item._id, e)}
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
