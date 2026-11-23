const fs = require('fs');
const path = require('path');
const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const { runAnalysis } = require('../services/analysisEngine');
const { extractTextFromBuffer } = require('../services/textExtractor');

// @desc    Analyze a resume against a job description
// @route   POST /api/analysis/analyze
// @access  Private
const analyzeResume = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, companyName, jobDescription, directText } = req.body;

    if (!jobTitle || jobTitle.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a target Job Title.',
      });
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a comprehensive Job Description (at least 20 characters).',
      });
    }

    let resumeDoc = null;
    let resumeText = '';
    let fileName = 'Direct-Input-Resume.txt';

    // Scenario A: User uploaded a new file in the same request
    if (req.file) {
      const file = req.file;
      const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
      fileName = file.originalname;

      const fileBuffer = fs.readFileSync(file.path);
      resumeText = await extractTextFromBuffer(fileBuffer, fileExt);

      resumeDoc = await Resume.create({
        userId: req.user._id,
        fileName: file.originalname,
        fileType: fileExt,
        fileSize: file.size,
        filePath: file.filename,
        extractedText: resumeText,
        characterCount: resumeText.length,
        wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      });
    }
    // Scenario B: User provided an existing resumeId
    else if (resumeId) {
      resumeDoc = await Resume.findById(resumeId);
      if (!resumeDoc) {
        return res.status(404).json({
          success: false,
          message: 'Selected resume not found.',
        });
      }
      if (resumeDoc.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to analyze this resume.',
        });
      }
      resumeText = resumeDoc.extractedText;
      fileName = resumeDoc.fileName;
    }
    // Scenario C: Direct resume text provided (useful for quick tests or demo)
    else if (directText && directText.trim().length >= 50) {
      resumeText = directText;
      fileName = 'Pasted-Resume.txt';
      resumeDoc = await Resume.create({
        userId: req.user._id,
        fileName,
        fileType: 'doc',
        fileSize: Buffer.byteLength(resumeText),
        extractedText: resumeText,
        characterCount: resumeText.length,
        wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select an existing resume, upload a PDF/DOCX file, or paste your resume text.',
      });
    }

    // Run Core Analysis Engine
    const analysisResults = await runAnalysis(
      resumeText,
      jobDescription,
      jobTitle,
      companyName || 'Target Organization'
    );

    // Save Analysis Record to MongoDB
    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resumeDoc._id,
      resumeFileName: fileName,
      jobTitle: jobTitle.trim(),
      companyName: (companyName || '').trim() || 'Confidential / Target Company',
      jobDescription: jobDescription.trim(),
      matchScore: analysisResults.matchScore,
      atsGrade: analysisResults.atsGrade,
      breakdown: analysisResults.breakdown,
      matchedSkills: analysisResults.matchedSkills,
      missingSkills: analysisResults.missingSkills,
      technicalSkills: analysisResults.technicalSkills,
      softSkills: analysisResults.softSkills,
      education: analysisResults.education,
      experience: analysisResults.experience,
      formattingFeedback: analysisResults.formattingFeedback,
      keywordSuggestions: analysisResults.keywordSuggestions,
      recommendations: analysisResults.recommendations,
      executiveSummary: analysisResults.executiveSummary,
      isAiGenerated: analysisResults.isAiGenerated,
      engineMode: analysisResults.engineMode,
      analysisDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Resume analysis generated successfully.',
      data: analysis,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    next(error);
  }
};

// @desc    Get analysis history for logged in user with search & filtering
// @route   GET /api/analysis/history
// @access  Private
const getAnalysisHistory = async (req, res, next) => {
  try {
    const { search, scoreFilter, sort = 'newest' } = req.query;

    const query = { userId: req.user._id };

    // Search filter (by jobTitle or companyName)
    if (search && search.trim() !== '') {
      query.$or = [
        { jobTitle: { $regex: search.trim(), $options: 'i' } },
        { companyName: { $regex: search.trim(), $options: 'i' } },
        { resumeFileName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Score filter
    if (scoreFilter === 'high') {
      query.matchScore = { $gte: 80 };
    } else if (scoreFilter === 'mid') {
      query.matchScore = { $gte: 60, $lt: 80 };
    } else if (scoreFilter === 'low') {
      query.matchScore = { $lt: 60 };
    }

    // Sort order
    let sortOptions = { analysisDate: -1 };
    if (sort === 'oldest') sortOptions = { analysisDate: 1 };
    if (sort === 'score_high') sortOptions = { matchScore: -1 };
    if (sort === 'score_low') sortOptions = { matchScore: 1 };

    const history = await Analysis.find(query)
      .select('-jobDescription') // exclude full JD for faster listing
      .sort(sortOptions);

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    // Security check
    if (analysis.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this analysis record.',
      });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete analysis record
// @route   DELETE /api/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.',
      });
    }

    if (analysis.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis record.',
      });
    }

    await analysis.deleteOne();

    res.json({
      success: true,
      message: 'Analysis record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
};
