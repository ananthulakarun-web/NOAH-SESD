const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['pdf', 'docx', 'doc'],
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    filePath: {
      type: String,
      required: false,
    },
    extractedText: {
      type: String,
      required: [true, 'Extracted text is required'],
    },
    characterCount: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ userId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
