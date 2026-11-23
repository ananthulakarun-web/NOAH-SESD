import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  Target,
  FileCheck,
  ShieldAlert,
  ArrowLeft,
  Printer,
  ChevronRight,
  TrendingUp,
  Cpu,
  HeartHandshake,
  Layout,
  Clock,
  Share2,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { analysisApi } from '../services/api';

export default function AnalysisResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'skills', 'experience', 'formatting', 'keywords'

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analysisApi.getAnalysisById(id);
      if (res.success && res.data) {
        setAnalysis(res.data);
      } else {
        setError(res.message || 'Analysis record could not be found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700">Retrieving ATS Analysis Diagnostic...</p>
        <p className="text-xs text-slate-400">Loading comprehensive skills comparison from database</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Analysis Record Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This record may have been deleted or is inaccessible.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const {
    jobTitle,
    companyName,
    resumeFileName,
    matchScore,
    atsGrade,
    breakdown = {},
    matchedSkills = [],
    missingSkills = [],
    technicalSkills = { resume: [], job: [], matched: [], missing: [] },
    softSkills = { resume: [], job: [], matched: [], missing: [] },
    education = {},
    experience = {},
    formattingFeedback = {},
    keywordSuggestions = [],
    recommendations = [],
    executiveSummary = '',
    engineMode = 'Rule-Based Deterministic ATS Engine',
    isAiGenerated = false,
    analysisDate,
  } = analysis;

  // Radar chart data for Section Score Breakdown
  const radarData = [
    { subject: 'Technical Skills', score: breakdown.technicalScore || 75, fullMark: 100 },
    { subject: 'Soft Skills', score: breakdown.softSkillsScore || 70, fullMark: 100 },
    { subject: 'Experience Depth', score: breakdown.experienceScore || 80, fullMark: 100 },
    { subject: 'Education Match', score: breakdown.educationScore || 85, fullMark: 100 },
    { subject: 'ATS Formatting', score: breakdown.formattingScore || 90, fullMark: 100 },
  ];

  // Score color helper
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/history" className="hover:text-purple-600 transition-colors">
            History
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 truncate max-w-[200px]">
            {jobTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-bg shadow-sm hover:brightness-105 transition-all"
          >
            <Zap className="w-4 h-4" />
            Analyze Another Job
          </Link>
        </div>
      </div>

      {/* Required Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-start gap-3 shadow-subtle">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">ATS Estimated Compatibility Notice:</strong> This score is an algorithmic estimation based on semantic keyword frequency, formatting indicators, and structural parsing. It is designed for preparation and optimization and is not a guaranteed rating from proprietary enterprise ATS platforms.
        </div>
      </div>

      {/* HERO SCORE CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left: Overall Score Dial */}
        <div className="flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center rounded-2xl gradient-bg text-white shadow-xl shadow-indigo-500/20">
            <div className="text-center">
              <span className="text-4xl font-black tracking-tight">{matchScore}</span>
              <span className="text-xs font-semibold text-purple-200 block">/ 100</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getScoreBg(matchScore)}`}>
              Grade {atsGrade} • {matchScore >= 80 ? 'Strong Match' : matchScore >= 60 ? 'Fair Match' : 'Needs Optimization'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {jobTitle}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {companyName || 'Target Company'}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600" /> {resumeFileName} • {new Date(analysisDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Middle: Engine Mode & Executive Summary */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Recruiter Summary
            </span>
            <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {engineMode}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            {executiveSummary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Matched Skills</span>
              <span className="text-base font-extrabold text-emerald-600">{matchedSkills.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Missing Keywords</span>
              <span className="text-base font-extrabold text-amber-600">{missingSkills.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Exp Detected</span>
              <span className="text-base font-extrabold text-slate-800">
                {experience.yearsDetected > 0 ? `${experience.yearsDetected}+ Yrs` : '1-2 Yrs'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Action Verbs</span>
              <span className="text-base font-extrabold text-purple-600">{experience.actionVerbsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Comprehensive Overview
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'skills'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" /> Skills Matrix ({technicalSkills.matched.length + softSkills.matched.length})
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'experience'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Experience & Education
        </button>
        <button
          onClick={() => setActiveTab('formatting')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'formatting'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" /> ATS Formatting Hygiene
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'keywords'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" /> Keyword Strategy
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Radar Chart */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Multidimensional Section Balance</h3>
                  <p className="text-xs text-slate-400">Scoring performance across 5 key hiring criteria</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#7c3aed"
                      fill="#8b5cf6"
                      fillOpacity={0.35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress bars list */}
              <div className="space-y-2.5 pt-2 text-xs">
                {radarData.map((item) => (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">{item.subject}</span>
                      <span className={getScoreColor(item.score)}>{item.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-bg transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioritized Actionable Recommendations */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Actionable Improvement Plan
                  </h3>
                  <p className="text-xs text-slate-400">
                    Highest-yield edits to boost your interview callback rate
                  </p>
                </div>
                <Zap className="w-4 h-4 text-purple-600" />
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : rec.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                    <span className="inline-block text-[10px] font-mono text-purple-600 font-semibold">
                      Category: {rec.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SKILLS MATRIX */}
      {activeTab === 'skills' && (
        <div className="space-y-8">
          {/* Matched vs Missing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matched Skills */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Matched Skills ({matchedSkills.length})
                    </h3>
                    <p className="text-xs text-slate-400">Successfully detected in your resume</p>
                  </div>
                </div>
              </div>

              {matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold flex items-center gap-1.5 shadow-subtle"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No exact skill matches identified.</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Missing Critical Skills ({missingSkills.length})
                    </h3>
                    <p className="text-xs text-slate-400">Emphasized in JD but absent in resume</p>
                  </div>
                </div>
              </div>

              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-semibold flex items-center gap-1.5 shadow-subtle"
                    >
                      <Target className="w-3.5 h-3.5 text-rose-500" />
                      + {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-semibold">
                  Outstanding! You have matched all required keywords in the job description.
                </p>
              )}
            </div>
          </div>

          {/* Technical vs Soft Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technical Skills Deep Dive */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                Technical Competencies
              </h4>
              <p className="text-xs text-slate-500">
                Total detected in your resume: {technicalSkills.resume.length} | Required in job: {technicalSkills.job.length}
              </p>
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-700">All Detected Resume Tech Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {technicalSkills.resume.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Soft Skills Deep Dive */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-600" />
                Soft Skills & Team Collaboration
              </h4>
              <p className="text-xs text-slate-500">
                Matched: {softSkills.matched.length} | Missing: {softSkills.missing.length}
              </p>
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-700">Detected Soft Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {softSkills.resume.length > 0 ? (
                    softSkills.resume.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No explicit soft skills detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: EXPERIENCE & EDUCATION */}
      {activeTab === 'experience' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Work Experience Analysis */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Work Experience Analysis</h3>
                <p className="text-xs text-slate-400">Seniority level and action verb strength</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Professional Experience:</span>
                <span className="font-bold text-slate-800">
                  {experience.yearsDetected > 0 ? `${experience.yearsDetected}+ Years` : '1-2 Years (Entry/Mid)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seniority Classification:</span>
                <span className="font-bold text-purple-700">{experience.levelEstimated || 'Mid-Level'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Action Verbs Detected:</span>
                <span className="font-bold text-emerald-600">{experience.actionVerbsCount || 0} strong verbs</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Recruiter Feedback:</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/40 p-3.5 rounded-xl border border-purple-100">
                {experience.feedback}
              </p>
            </div>

            {experience.strongActionVerbs && experience.strongActionVerbs.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Verbs Found in Resume:</span>
                <div className="flex flex-wrap gap-1.5">
                  {experience.strongActionVerbs.map((v) => (
                    <span key={v} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      ✓ {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Education Analysis */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Education & Credentials</h3>
                <p className="text-xs text-slate-400">Academic degree verification check</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Detected Degree:</span>
                <span className="font-bold text-slate-800">{education.degreeFound}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requirement Fit:</span>
                <span className="font-bold text-emerald-600">
                  {education.isMatch ? 'Prerequisites Satisfied' : 'Review Qualification'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Academic Alignment Notes:</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/40 p-3.5 rounded-xl border border-blue-100">
                {education.feedback}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: FORMATTING & ATS HYGIENE */}
      {activeTab === 'formatting' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ATS Structural & Format Health
                </h3>
                <p className="text-xs text-slate-400">
                  Clean parsing verification for automated hiring systems
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Format Health Score:</span>
              <span className="text-2xl font-black text-purple-600">
                {formattingFeedback.score || 85}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="text-slate-400 block font-medium">Contact Email</span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                {formattingFeedback.hasEmail ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detected
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" /> Missing
                  </>
                )}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="text-slate-400 block font-medium">Phone Number</span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                {formattingFeedback.hasPhone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detected
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" /> Missing
                  </>
                )}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="text-slate-400 block font-medium">LinkedIn / Portfolio</span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                {formattingFeedback.hasLinks ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Present
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> None Detected
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Detailed findings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Diagnostic Observations
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {formattingFeedback.findings?.map((f, i) => (
                <li key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: KEYWORD OPTIMIZATION STRATEGY */}
      {activeTab === 'keywords' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Keyword Density & Placement Strategy
              </h3>
              <p className="text-xs text-slate-400">
                High-importance keywords evaluated against applicant screening criteria
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                  <th className="pb-3">Keyword / Technology</th>
                  <th className="pb-3">ATS Importance</th>
                  <th className="pb-3">Status in Resume</th>
                  <th className="pb-3">Recruiter Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keywordSuggestions.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-800">{kw.keyword}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          kw.importance === 'Critical'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {kw.importance}
                      </span>
                    </td>
                    <td className="py-3">
                      {kw.present ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                          <XCircle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-500">{kw.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
