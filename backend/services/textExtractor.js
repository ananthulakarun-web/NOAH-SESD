const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw text from uploaded resume buffer/file.
 * Supports PDF and DOCX/DOC formats.
 */
async function extractTextFromBuffer(buffer, fileType) {
  if (!buffer || buffer.length === 0) {
    throw new Error('File buffer is empty');
  }

  const normalizedType = (fileType || '').toLowerCase().replace('.', '');

  if (normalizedType === 'pdf') {
    try {
      const data = await pdfParse(buffer);
      if (!data || !data.text || data.text.trim().length === 0) {
        throw new Error('PDF file appears to be an image or contains no readable text');
      }
      return cleanExtractedText(data.text);
    } catch (err) {
      throw new Error(`PDF Parsing failed: ${err.message}`);
    }
  } else if (normalizedType === 'docx' || normalizedType === 'doc') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (!result || !result.value || result.value.trim().length === 0) {
        throw new Error('DOCX file contains no readable text');
      }
      return cleanExtractedText(result.value);
    } catch (err) {
      throw new Error(`DOCX Parsing failed: ${err.message}`);
    }
  } else {
    // If text file or unknown supported format
    const text = buffer.toString('utf-8');
    return cleanExtractedText(text);
  }
}

/**
 * Cleans extracted text by normalizing whitespace, removing weird binary chars,
 * and standardizing line breaks.
 */
function cleanExtractedText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

module.exports = {
  extractTextFromBuffer,
  cleanExtractedText,
};
