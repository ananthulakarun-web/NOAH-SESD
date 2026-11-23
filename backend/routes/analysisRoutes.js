const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect); // All analysis routes are protected

// Allows both multipart upload with resume file or JSON body with resumeId
router.post('/analyze', upload.single('resume'), analyzeResume);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

module.exports = router;
