const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect); // All resume routes are protected

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
