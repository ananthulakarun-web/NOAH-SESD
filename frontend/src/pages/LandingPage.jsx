import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Zap,
  BarChart3,
  ShieldCheck,
  Target,
  FileCheck,
  Award,
  ChevronDown,
  Star,
  Users,
  Briefcase,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  // Quick Demo Access: logs in as demo candidate and takes user directly to dashboard
  const handleTryDemo = async () => {
    setDemoLoading(true);
    const res = await login('demo@resumeai.com', 'demo123');
    setDemoLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const faqs = [
    {
      q: 'How does the ATS Resume Analyzer calculate my compatibility score?',
      a: 'The engine parses your resume using specialized document extraction, tokenizes technical skills, soft skills, and action verbs, and compares them with the target job description. The final score is weighted across technical alignment (45%), experience impact (20%), soft competencies (15%), structural formatting (10%), and education (10%).',
    },
    {
      q: 'Will this guarantee that I pass any company’s ATS filter?',
      a: 'No automated tool can provide an absolute guarantee, as different companies configure ATS filters (like Workday, Taleo, or Greenhouse) differently. However, ResumeAI’s diagnostics are modeled on industry best practices to maximize parseability and eliminate common filtering traps.',
    },
    {
      q: 'What file formats are supported for upload?',
      a: 'We fully support modern PDF (.pdf) and Microsoft Word (.docx, .doc) files up to 5MB in size. We recommend standard single-column text-based PDFs for best results.',
    },
    {
      q: 'How is this different from generic resume builders?',
      a: 'Unlike generic template tools, ResumeAI analyzes your resume specifically against a target job description, pinpointing exact missing keywords, structural vulnerabilities, and passive phrasing in real time.',
    },
    {
      q: 'Is my resume data kept private and secure?',
      a: 'Yes. Your uploaded files and analysis records are protected by JWT authentication and strict user-specific access control in MongoDB. Other users can never view your resume data.',
    },
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Frontend Engineer at TechCorp',
      content:
        'ResumeAI helped me realize my resume was missing key terms like GraphQL and CI/CD that were in the job description. After tailoring my bullet points, I received 3 callbacks in two weeks!',
      sampleLabel: 'Demo Candidate Testimonial',
      score: 'Score: 62% → 89%',
    },
    {
      name: 'Priya Patel',
      role: 'Recent B.Tech CSE Graduate',
      content:
        'As a fresh graduate, I struggled to know if my project descriptions sounded strong enough. The action verb suggestions and formatting feedback transformed my campus placement resume.',
      sampleLabel: 'Demo Candidate Testimonial',
      score: 'Score: 54% → 84%',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Full-Stack Developer',
      content:
        'The missing skill keyword breakdown is a game changer. I used to apply with a generic resume; now I spend 2 minutes checking each application and my response rate skyrocketed.',
      sampleLabel: 'Demo Candidate Testimonial',
      score: 'Score: 71% → 94%',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/40 via-indigo-200/40 to-blue-200/30 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-semibold shadow-subtle hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Next-Gen ATS Compatibility & AI Diagnostics
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Build a Resume That{' '}
            <span className="gradient-text">Gets You Hired.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Scan your resume against any job description. Uncover missing keywords, diagnose ATS formatting issues, and receive actionable engineering recommendations in seconds.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={isAuthenticated ? '/analyze' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white gradient-bg shadow-md hover:shadow-indigo-500/25 hover:brightness-105 active:scale-95 transition-all text-base"
            >
              Analyze Your Resume Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleTryDemo}
              disabled={demoLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200/90 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all text-base"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              {demoLoading ? 'Launching Demo...' : 'Try Live Demo (1-Click)'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Supports PDF & DOCX
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strict Data Privacy
            </span>
          </div>

          {/* Preview Illustration / Interactive Mockup Card */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/60 to-slate-100/30 border border-slate-200/80 shadow-2xl backdrop-blur-sm">
              <div className="rounded-xl bg-white border border-slate-100 p-6 sm:p-8 shadow-inner text-left">
                {/* Header mock */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                      88
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Senior Full-Stack Engineer — Diagnostics
                      </h2>
                      <p className="text-xs text-slate-400">
                        Resume: Alex_Morgan_Resume.pdf • Target: Stripe / Fintech
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Grade: A (Strong Match)
                    </span>
                  </div>
                </div>

                {/* Grid preview mock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                  {/* Matched Skills */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        Matched Skills (14)
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind', 'REST API', 'Docker'].map(
                        (s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        Missing Keywords (3)
                      </span>
                      <Target className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Kubernetes', 'Redis', 'GraphQL'].map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 text-[11px] font-medium"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-amber-700 mt-2 font-medium">
                      High frequency in job description. Add to your skills list.
                    </p>
                  </div>

                  {/* Formatting Health */}
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 uppercase">
                        ATS Hygiene (92%)
                      </span>
                      <FileCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <ul className="text-[11px] text-slate-600 space-y-1.5">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Clean single-column layout
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Email & LinkedIn detected
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Strong action verbs found (8)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl gradient-bg p-8 text-white shadow-xl shadow-indigo-500/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">100k+</div>
            <p className="text-xs sm:text-sm text-purple-100 mt-1">Resumes Analyzed</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">88%</div>
            <p className="text-xs sm:text-sm text-purple-100 mt-1">Interview Boost Rate</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">500+</div>
            <p className="text-xs sm:text-sm text-purple-100 mt-1">Tech Skills Indexed</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">&lt; 3s</div>
            <p className="text-xs sm:text-sm text-purple-100 mt-1">Average Scan Speed</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Modern Hiring Pipelines
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            Every feature is designed to bridge the gap between candidate resumes and modern automated hiring algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Deep Skill Extraction</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Detects programming languages, cloud platforms, frameworks, and architecture patterns from both your resume and the target role description.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Weighted Match Scoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Calculates a multidimensional ATS match score based on technical competencies, years of experience, action verb impact, and credentials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Missing Keyword Discovery</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never get eliminated by screening bots again. See the exact high-value keywords and domain tools required by the recruiter that your resume lacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Action Verb Diagnostics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Identifies passive phrasing and suggests dynamic engineering action verbs (e.g. Engineered, Spearheaded, Optimized) to command recruiter respect.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Formatting & ATS Hygiene</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Checks document parseability, standard section headings, contact information extraction (email, phone, LinkedIn), and bullet point density.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personalized Recommendations</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generates prioritized step-by-step action items categorized into High, Medium, and Low impact to systematically elevate your match score.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How ResumeAI Operates in 4 Simple Steps
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            From raw document to deep diagnostic insights in less than 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative">
            <span className="text-4xl font-black text-slate-100 absolute top-4 right-4">01</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Upload Resume</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag and drop your PDF or DOCX resume. Our parser instantly extracts text and sanitizes layout structures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative">
            <span className="text-4xl font-black text-slate-100 absolute top-4 right-4">02</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Paste Job Spec</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste the target job description, title, and company name to establish your tailored benchmark.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative">
            <span className="text-4xl font-black text-slate-100 absolute top-4 right-4">03</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Run Diagnostics</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our rule-based engine and optional LLM cross-evaluate technical skills, experience depth, and formatting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative">
            <span className="text-4xl font-black text-slate-100 absolute top-4 right-4">04</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center mb-4">
              4
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Optimize & Apply</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Implement prioritized suggestions, insert missing keywords, and apply with high confidence.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                Real-World Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed for College Grads & Experienced Tech Talent
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you are a Computer Science student preparing for campus placements or a senior engineer aiming for top tier product firms, ResumeAI removes the guesswork from job applications.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Bypass Automated Rejection Bots</h4>
                    <p className="text-xs text-slate-400">Eliminate formatting artifacts and missing synonyms that trigger 75% of auto-disqualifications.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Quantify Project Accomplishments</h4>
                    <p className="text-xs text-slate-400">Highlight metrics, user scale, and architectural choices that hiring managers look for.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Save Hours of Manual Tailoring</h4>
                    <p className="text-xs text-slate-400">Get an instant roadmap of exactly which 3-5 keywords to add for each company.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">
                Placement & Hiring Metrics
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 flex justify-between items-center">
                  <span className="text-slate-300">Technical Keyword Alignment</span>
                  <span className="font-bold text-emerald-400">94% Target</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 flex justify-between items-center">
                  <span className="text-slate-300">ATS Parsing Reliability</span>
                  <span className="font-bold text-purple-400">99.2% Accuracy</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 flex justify-between items-center">
                  <span className="text-slate-300">Average Improvement per Scan</span>
                  <span className="font-bold text-blue-400">+28 Score Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (With clearly identified demo/sample testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Trusted by Job Seekers & Developers
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Read sample candidate feedback showcasing how iterative ATS scoring improves interview callbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {t.score}
                  </span>
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
                <span className="inline-block mt-2 text-[10px] text-slate-400 font-mono">
                  [{t.sampleLabel}]
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Fair & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Simple Pricing for Everyone
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Start completely free for campus placements or upgrade for unlimited corporate scans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900">Student & Free</h3>
              <p className="text-xs text-slate-500">Perfect for initial resume checks and university placement preparation.</p>
              <div className="text-3xl font-extrabold text-slate-900">
                $0 <span className="text-sm font-normal text-slate-500">/ forever</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 10 Full Resume Analyses / Month
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> PDF & DOCX Text Extraction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Missing Skill Keyword Lists
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Formatting & ATS Hygiene Check
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="p-8 rounded-2xl bg-white border-2 border-purple-600 shadow-xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold text-white gradient-bg uppercase tracking-wider shadow-sm">
              Most Popular
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900">Pro Job Hunter</h3>
              <p className="text-xs text-slate-500">For active job seekers who want deep AI optimization and unlimited scans.</p>
              <div className="text-3xl font-extrabold text-slate-900">
                $12 <span className="text-sm font-normal text-slate-500">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-2">
                <li className="flex items-center gap-2 font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Resume Analyses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> AI Bullet Point Rewriter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Prioritized Action Roadmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Full History & PDF Reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Priority Processing Speed
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg shadow-md hover:brightness-105 transition-all"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* University / Enterprise */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900">College & Campus</h3>
              <p className="text-xs text-slate-500">For university placement cells and career coaching institutions.</p>
              <div className="text-3xl font-extrabold text-slate-900">
                $49 <span className="text-sm font-normal text-slate-500">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Multi-Student Cohort Access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Administrator Analytics Panel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Batch Job Description Matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Placement Cell Support
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Contact Placements
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about our ATS analysis engine and security.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-subtle transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left text-sm font-bold text-slate-800 hover:bg-slate-50/80 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                    activeFaq === i ? 'rotate-180 text-purple-600' : ''
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl gradient-bg p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl shadow-indigo-500/20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Land More Software Engineering Interviews?
          </h2>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Stop guessing what recruiters want. Test your resume against live requirements right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all text-base"
            >
              Create Free Account
            </Link>
            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white border border-white/40 hover:bg-white/10 transition-all text-base"
            >
              Explore Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
