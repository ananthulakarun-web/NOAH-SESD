import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Shield, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-xl group">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold tracking-tight">
                Resume<span className="text-purple-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering engineers and tech professionals with actionable, recruiter-aligned ATS diagnostics to land high-impact interviews.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-950/60 border border-purple-800/60 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/analyze" className="hover:text-purple-400 transition-colors">
                  Resume Scanner
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-purple-400 transition-colors">
                  ATS Score Prediction
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-purple-400 transition-colors">
                  Skill Gap Analysis
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-purple-400 transition-colors">
                  Subscription Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/#faq" className="hover:text-purple-400 transition-colors">
                  ATS FAQ Guide
                </a>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Action Verbs Playbook (Free)
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Tech Skill Taxonomy
                </span>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">
                  Candidate Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Project Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Engineering
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built as a comprehensive final-year B.Tech Computer Science Engineering capstone project & modern SaaS architecture.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">React + Vite</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Node + Express</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">MongoDB</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">TailwindCSS</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner (Required by prompt) */}
        <div className="my-8 p-4 rounded-xl bg-slate-800/50 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-200">ATS Estimation Disclaimer:</strong> The ATS compatibility score and recommendations provided by ResumeAI are algorithmic approximations designed to help candidates align their resumes with modern job descriptions. They do not guarantee interview callbacks or represent proprietary scorecards of third-party applicant tracking systems (e.g. Workday, Greenhouse, Taleo).
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ResumeAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
