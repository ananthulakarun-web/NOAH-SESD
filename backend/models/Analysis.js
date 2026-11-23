const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    resumeFileName: {
      type: String,
      default: 'Resume.pdf',
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: 'Confidential / Not Specified',
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    atsGrade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'Needs Improvement'],
      default: 'B',
    },
    breakdown: {
      technicalScore: { type: Number, default: 0 },
      softSkillsScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      formattingScore: { type: Number, default: 0 },
    },
    matchedSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    missingSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    technicalSkills: {
      resume: [{ type: String }],
      job: [{ type: String }],
      matched: [{ type: String }],
      missing: [{ type: String }],
    },
    softSkills: {
      resume: [{ type: String }],
      job: [{ type: String }],
      matched: [{ type: String }],
      missing: [{ type: String }],
    },
    education: {
      degreeFound: { type: String, default: 'Not specified' },
      isMatch: { type: Boolean, default: true },
      feedback: { type: String, default: '' },
    },
    experience: {
      yearsDetected: { type: Number, default: 0 },
      levelEstimated: { type: String, default: 'Entry-to-Mid' },
      feedback: { type: String, default: '' },
      actionVerbsCount: { type: Number, default: 0 },
      strongActionVerbs: [{ type: String }],
    },
    formattingFeedback: {
      score: { type: Number, default: 85 },
      findings: [{ type: String }],
      tips: [{ type: String }],
      hasEmail: { type: Boolean, default: true },
      hasPhone: { type: Boolean, default: true },
      hasLinks: { type: Boolean, default: false },
      sectionCount: { type: Number, default: 0 },
      detectedSections: [{ type: String }],
    },
    keywordSuggestions: [
      {
        keyword: { type: String },
        importance: { type: String, enum: ['Critical', 'Recommended', 'Nice to have'] },
        present: { type: Boolean, default: false },
        reason: { type: String },
      },
    ],
    recommendations: [
      {
        category: { type: String },
        priority: { type: String, enum: ['High', 'Medium', 'Low'] },
        title: { type: String },
        description: { type: String },
      },
    ],
    executiveSummary: {
      type: String,
      default: '',
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
    engineMode: {
      type: String,
      default: 'Rule-Based ATS Engine',
    },
    analysisDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast history queries
analysisSchema.index({ userId: 1, analysisDate: -1 });
analysisSchema.index({ matchScore: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
