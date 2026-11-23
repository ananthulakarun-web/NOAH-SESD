const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { extractTextFromBuffer } = require('../services/textExtractor');

// @desc    Upload a resume file (PDF/DOCX) & extract text
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Please attach a valid PDF or DOCX file.',
      });
    }

    const file = req.file;
    const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
    
    // Read buffer from disk
    const fileBuffer = fs.readFileSync(file.path);

    // Extract text
    let extractedText = '';
    try {
      extractedText = await extractTextFromBuffer(fileBuffer, fileExt);
    } catch (parseError) {
      // Remove temp file
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(422).json({
        success: false,
        message: `Failed to extract text from ${file.originalname}: ${parseError.message}`,
      });
    }

    if (!extractedText || extractedText.length < 50) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(422).json({
        success: false,
        message: 'Extracted text is too short. Ensure the resume has readable text and is not a scanned image.',
      });
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
    const characterCount = extractedText.length;

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: file.originalname,
      fileType: fileExt,
      fileSize: file.size,
      filePath: file.filename,
      extractedText,
      characterCount,
      wordCount,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully.',
      data: resume,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    next(error);
  }
};

// @desc    Get all resumes of logged-in user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-extractedText') // exclude full text for lightweight list
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // Security check: ensure user owns resume or is admin
    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume.',
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resume.',
      });
    }

    // Delete stored file if exists
    if (resume.filePath) {
      const fullPath = path.join(__dirname, '..', 'uploads', resume.filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {}
      }
    }

    // Remove associated analyses
    await Analysis.deleteMany({ resumeId: resume._id });

    // Remove resume
    await resume.deleteOne();

    res.json({
      success: true,
      message: 'Resume and associated analyses deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
};
