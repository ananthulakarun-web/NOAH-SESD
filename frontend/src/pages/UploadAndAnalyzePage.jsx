import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Building,
  FileCheck,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { analysisApi, resumeApi } from '../services/api';

export default function UploadAndAnalyzePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [companyName, setCompanyName] = useState('Tech Solutions Inc.');
  const [jobDescription, setJobDescription] = useState('');
  const [existingResumes, setExistingResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' or 'select' or 'paste'
  const [directText, setDirectText] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Load existing resumes if user wants to re-use an uploaded document
  useEffect(() => {
    resumeApi.getResumes().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setExistingResumes(res.data);
      }
    }).catch(() => {});
  }, []);

  const sampleJobDescriptions = [
    {
      title: 'Senior Full-Stack Engineer',
      company: 'Stripe / Fintech',
      desc: `We are looking for an experienced Senior Full-Stack Software Engineer to build scalable payment infrastructure and modern web applications.
Requirements:
- 3+ years of professional software engineering experience with React, TypeScript, and Node.js.
- Strong knowledge of MongoDB, PostgreSQL, REST APIs, GraphQL, and microservices architecture.
- Hands-on experience with Docker, Kubernetes, CI/CD, and AWS cloud deployment.
- Familiarity with Jest, unit testing, and agile methodologies.
- Excellent communication, problem solving, and cross-functional team collaboration skills.
- Bachelor's degree (B.Tech / B.S.) in Computer Science, Software Engineering, or related technical field.`,
    },
    {
      title: 'Frontend React Developer',
      company: 'SaaS Platform',
      desc: `Seeking a talented Frontend Developer passionate about modern responsive UI/UX and web performance.
Requirements:
- Strong proficiency in JavaScript (ES6+), TypeScript, React.js, and Next.js.
- Deep expertise in Tailwind CSS, HTML5, CSS3, Redux Toolkit, and Vite build tooling.
- Experience consuming RESTful APIs and optimizing client-side performance.
- Familiarity with Git, GitHub Actions, Cypress, and responsive web design principles.
- High attention to detail, teamwork, and ability to deliver clean, maintainable code.`,
    },
    {
      title: 'AI & Data Platform Engineer',
      company: 'Cloud Innovations',
      desc: `Join our data engineering team to design AI-driven data pipelines and intelligent applications.
Requirements:
- Bachelor's or Master's in Computer Science, Data Science, or related field.
- Proficiency in Python, SQL, REST APIs, and backend frameworks (FastAPI or Flask).
- Experience with Machine Learning libraries: PyTorch, TensorFlow, Scikit-learn, Pandas, and NumPy.
- Familiarity with Cloud platforms (GCP or AWS), Docker, Git, and automated testing.
- Strong analytical thinking, adaptability, and proactive problem solving capabilities.`,
    },
  ];

  const handleSelectSampleJD = (sample) => {
    setJobTitle(sample.title);
    setCompanyName(sample.company);
    setJobDescription(sample.desc);
    setError('');
  };

  // Sample Resume Quick-Load for instant testing without needing an external file
  const handleLoadSampleResume = () => {
    setMode('paste');
    setDirectText(`ALEX MORGAN
alex.morgan@example.com | +1 (555) 234-5678 | San Francisco, CA
linkedin.com/in/alexmorgan-dev | github.com/alexmorgan-tech

PROFESSIONAL SUMMARY
Results-driven Full-Stack Software Engineer with 4+ years of hands-on experience designing and scaling web applications, microservices, and modern user interfaces. Proficient in React.js, Node.js, TypeScript, MongoDB, and AWS cloud ecosystems.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, HTML5, CSS3
- Frontend: React, Redux, Next.js, Tailwind CSS, Bootstrap, Vite
- Backend: Node.js, Express.js, REST API, GraphQL, Microservices
- Databases: MongoDB, PostgreSQL, Redis, Mongoose
- Cloud & DevOps: Docker, AWS (S3, Lambda), Git, GitHub Actions, CI/CD
- Testing & Tools: Jest, Postman, Agile, Scrum, Jira

EXPERIENCE
Software Engineer | NexaTech Solutions (2022 - Present)
- Engineered scalable RESTful microservices in Node.js and Express, handling over 2M+ monthly API requests with 99.9% uptime.
- Architected intuitive responsive dashboards with React, TypeScript, and Tailwind CSS, increasing candidate retention by 32%.
- Optimized MongoDB aggregation queries and implemented Redis caching, reducing average response latency by 45%.
- Automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing weekly release cycle times by 3 hours.
- Collaborated across cross-functional teams in agile sprints, participating in daily standups and code reviews.

Junior Developer | CloudWave Systems (2020 - 2022)
- Built interactive frontend components in React and integrated third-party RESTful APIs.
- Authored unit test suites using Jest, boosting test coverage across core modules from 65% to 88%.
- Spearheaded database schema migrations and data sanitization routines.

EDUCATION
Bachelor of Technology (B.Tech) in Computer Science & Engineering
State University of Technology (2016 - 2020) | GPA: 3.8/4.0`);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    // Check size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    // Check extension
    const allowed = ['.pdf', '.docx', '.doc'];
    const name = selectedFile.name.toLowerCase();
    const isAllowed = allowed.some((ext) => name.endsWith(ext));

    if (!isAllowed) {
      setError('Invalid file type. Please upload a PDF (.pdf) or Word document (.docx, .doc).');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!jobTitle.trim()) {
      setError('Please provide a target Job Title.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError('Please paste a comprehensive Job Description (at least 20 characters).');
      return;
    }

    if (mode === 'upload' && !file) {
      setError('Please upload a PDF or DOCX resume, or switch to paste mode.');
      return;
    }

    if (mode === 'select' && !selectedResumeId) {
      setError('Please select an existing resume from your account.');
      return;
    }

    if (mode === 'paste' && (!directText || directText.trim().length < 50)) {
      setError('Please paste your resume text (at least 50 characters).');
      return;
    }

    setLoading(true);
    setLoadingStep(1);

    // Simulated progress indicators for UX
    const timer1 = setTimeout(() => setLoadingStep(2), 700);
    const timer2 = setTimeout(() => setLoadingStep(3), 1500);

    try {
      let res = null;

      if (mode === 'upload') {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobTitle', jobTitle);
        formData.append('companyName', companyName);
        formData.append('jobDescription', jobDescription);

        res = await analysisApi.analyze(formData, true);
      } else if (mode === 'select') {
        res = await analysisApi.analyze({
          resumeId: selectedResumeId,
          jobTitle,
          companyName,
          jobDescription,
        });
      } else {
        res = await analysisApi.analyze({
          directText,
          jobTitle,
          companyName,
          jobDescription,
        });
      }

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (res.success && res.data) {
        navigate(`/analysis/${res.data._id}`);
      } else {
        setError(res.message || 'Analysis failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setError(err.message || 'Error occurred during analysis.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          ATS Scanner & Match Diagnostic
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Your Resume Against a Target Job
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Upload your resume file or paste text, supply the employer's job description, and let our deterministic ATS algorithm uncover your alignment.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Validation Notice</h4>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: Resume Input */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 1: Your Resume
                </h2>
                <p className="text-xs text-slate-400">PDF, DOCX, or direct paste</p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    mode === 'upload' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload File
                </button>
                {existingResumes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMode('select')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      mode === 'select' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Saved ({existingResumes.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode('paste')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    mode === 'paste' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Sub-mode A: Drag & Drop Upload */}
            {mode === 'upload' && (
              <div className="space-y-4">
                {!file ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-purple-600 bg-purple-50/50'
                        : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PDF and DOCX files (Up to 5MB)
                    </p>
                    <span className="inline-block mt-4 text-[11px] font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      Browse Files
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-bg text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[220px]">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB • {file.name.split('.').pop().toUpperCase()} Document
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove File"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                  <span>Need an instant sample resume?</span>
                  <button
                    type="button"
                    onClick={handleLoadSampleResume}
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Load Sample Resume Text
                  </button>
                </div>
              </div>
            )}

            {/* Sub-mode B: Select Saved Resume */}
            {mode === 'select' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">Choose from Saved Resumes</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {existingResumes.map((resDoc) => (
                    <div
                      key={resDoc._id}
                      onClick={() => setSelectedResumeId(resDoc._id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedResumeId === resDoc._id
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <p className="font-semibold">{resDoc.fileName}</p>
                          <p className="text-[10px] text-slate-400">
                            Uploaded {new Date(resDoc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedResumeId === resDoc._id && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-mode C: Paste Resume Text */}
            {mode === 'paste' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Resume Plain Text</label>
                  <button
                    type="button"
                    onClick={handleLoadSampleResume}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Quick Load Sample Candidate
                  </button>
                </div>
                <textarea
                  rows={8}
                  placeholder="Paste your resume sections, technical skills, and work history here..."
                  value={directText}
                  onChange={(e) => setDirectText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                ></textarea>
                <p className="text-[11px] text-slate-400">
                  {directText.length} characters ({directText.split(/\s+/).filter(Boolean).length} words)
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Target Job Description */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Step 2: Target Job Details
                </h2>
                <p className="text-xs text-slate-400">Role specifications for ATS benchmark</p>
              </div>
            </div>

            {/* Quick Sample JD Loaders */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick-Fill Target Job:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleJobDescriptions.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSampleJD(sample)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Job Title</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Company Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Google, or Startup"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Job Description / Required Skills
              </label>
              <textarea
                rows={7}
                required
                placeholder="Paste the complete requirements, responsibilities, and qualifications from the job posting..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              ></textarea>
              <p className="text-[11px] text-slate-400">
                {jobDescription.length} characters ({jobDescription.split(/\s+/).filter(Boolean).length} words)
              </p>
            </div>
          </div>
        </div>

        {/* Submit Action Box */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ready for AI & Algorithmic Scan
              </h3>
              <p className="text-xs text-slate-500">
                Generates ATS score, missing skills list, and prioritized recommendations.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white gradient-bg shadow-md hover:shadow-indigo-500/25 hover:brightness-105 active:scale-95 transition-all text-sm disabled:opacity-70 min-w-[200px]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {loadingStep === 1
                  ? 'Extracting Text...'
                  : loadingStep === 2
                  ? 'Parsing Skills...'
                  : 'Computing ATS Score...'}
              </>
            ) : (
              <>
                Start AI Analysis <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
