const { TECHNICAL_SKILLS, SOFT_SKILLS, ACTION_VERBS, SYNONYMS } = require('./skillTaxonomy');

/**
 * Escapes regex special characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalizes text to lowercase and cleans punctuation for matching
 */
function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase();
}

/**
 * Detects all skills from a text given a taxonomy list
 */
function extractSkills(text, skillList) {
  const normText = normalizeText(text);
  const foundSkills = new Set();

  skillList.forEach((skill) => {
    const canonical = SYNONYMS[skill] || skill;
    // Boundary match: ensure skill is matched as a discrete word or token
    const pattern = new RegExp(`(^|[^a-zA-Z0-9#+.-])${escapeRegex(skill)}($|[^a-zA-Z0-9#+.-])`, 'i');
    if (pattern.test(normText)) {
      foundSkills.add(canonical);
    }
  });

  return Array.from(foundSkills);
}

/**
 * Extracts action verbs present in the resume
 */
function extractActionVerbs(text) {
  const normText = normalizeText(text);
  const foundVerbs = [];

  ACTION_VERBS.forEach((verb) => {
    const pattern = new RegExp(`\\b${escapeRegex(verb)}\\b`, 'i');
    if (pattern.test(normText)) {
      foundVerbs.push(verb);
    }
  });

  return foundVerbs;
}

/**
 * Analyzes contact info and structural formatting
 */
function analyzeFormatting(text) {
  const findings = [];
  const tips = [];
  let score = 100;

  // Email detection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const hasEmail = emailRegex.test(text);
  if (hasEmail) {
    findings.push('Professional contact email detected.');
  } else {
    score -= 15;
    findings.push('Missing contact email address.');
    tips.push('Add a clear, professional email address at the top header.');
  }

  // Phone detection
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;
  const hasPhone = phoneRegex.test(text);
  if (hasPhone) {
    findings.push('Contact telephone/mobile number detected.');
  } else {
    score -= 10;
    findings.push('No obvious phone number found.');
    tips.push('Include a reachable phone number with country code.');
  }

  // LinkedIn / GitHub / Portfolio links
  const linkRegex = /(linkedin\.com|github\.com|gitlab\.com|portfolio|http:\/\/|https:\/\/)/i;
  const hasLinks = linkRegex.test(text);
  if (hasLinks) {
    findings.push('Professional links (LinkedIn / GitHub / Portfolio) found.');
  } else {
    score -= 10;
    findings.push('No LinkedIn or GitHub profile link found.');
    tips.push('Include clickable or plain-text links to your LinkedIn profile and GitHub or portfolio.');
  }

  // Section Headers
  const commonSections = ['experience', 'education', 'skills', 'projects', 'certifications', 'summary', 'objective'];
  const detectedSections = [];
  commonSections.forEach((section) => {
    const regex = new RegExp(`(^|\\n)\\s*(${section})\\b`, 'i');
    if (regex.test(text)) {
      detectedSections.push(section.charAt(0).toUpperCase() + section.slice(1));
    }
  });

  if (detectedSections.length >= 4) {
    findings.push(`Standard ATS section headings detected (${detectedSections.join(', ')}).`);
  } else {
    score -= 15;
    findings.push(`Only ${detectedSections.length} standard section headers detected.`);
    tips.push('Ensure standard headings like Experience, Skills, Education, and Projects are distinctly labeled.');
  }

  // Bullet point usage
  const bulletCount = (text.match(/[\u2022\u2023\u25E6\u2043\u2219\*\-]\s/g) || []).length;
  if (bulletCount >= 5) {
    findings.push('Bullet points effectively used for scanability.');
  } else {
    score -= 10;
    findings.push('Low usage of bullet points. Content may appear as dense paragraphs.');
    tips.push('Convert dense paragraph descriptions into concise bullet points (3-5 per role).');
  }

  // Length check (word count)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    score -= 20;
    findings.push(`Resume is very brief (~${wordCount} words).`);
    tips.push('Expand on project achievements, technical tools used, and measurable results.');
  } else if (wordCount > 1000) {
    score -= 5;
    findings.push(`Resume is quite lengthy (~${wordCount} words).`);
    tips.push('Condense content to 1-2 pages focusing on your most relevant high-impact experience.');
  } else {
    findings.push(`Optimal resume length (~${wordCount} words).`);
  }

  score = Math.max(20, Math.min(100, score));

  return {
    score,
    findings,
    tips,
    hasEmail,
    hasPhone,
    hasLinks,
    sectionCount: detectedSections.length,
    detectedSections,
  };
}

/**
 * Analyzes Education credentials
 */
function analyzeEducation(resumeText, jobDescription) {
  const normResume = normalizeText(resumeText);
  const normJD = normalizeText(jobDescription);

  const degreeKeywords = [
    { title: 'Ph.D. / Doctorate', regex: /\b(ph\.?d|doctorate)\b/i },
    { title: 'Master’s Degree (M.S. / M.Tech / M.E. / MBA)', regex: /\b(master'?s|m\.?s|m\.?tech|m\.?e|msc|mba)\b/i },
    { title: 'Bachelor’s Degree (B.S. / B.Tech / B.E. / BCA)', regex: /\b(bachelor'?s|b\.?s|b\.?tech|b\.?e|bsc|bca)\b/i },
    { title: 'Associate Degree / Diploma', regex: /\b(associate|diploma)\b/i },
  ];

  let degreeFound = 'Not explicitly detected';
  for (const deg of degreeKeywords) {
    if (deg.regex.test(normResume)) {
      degreeFound = deg.title;
      break;
    }
  }

  let requiredDegree = 'Any Degree / Not strictly specified';
  for (const deg of degreeKeywords) {
    if (deg.regex.test(normJD)) {
      requiredDegree = deg.title;
      break;
    }
  }

  const isMatch = degreeFound !== 'Not explicitly detected';
  let feedback = '';
  if (isMatch) {
    feedback = `Verified educational credential: ${degreeFound}. Matches typical industry prerequisite.`;
  } else {
    feedback = 'Educational background is not clearly highlighted with standard degree naming (e.g. B.Tech, B.S., M.S.).';
  }

  const score = isMatch ? 90 : 50;

  return {
    degreeFound,
    requiredDegree,
    isMatch,
    score,
    feedback,
  };
}

/**
 * Analyzes Experience and Action verbs
 */
function analyzeExperience(resumeText, jobDescription) {
  const normResume = normalizeText(resumeText);
  const normJD = normalizeText(jobDescription);

  // Detect years of experience mentioned in resume
  const expMatch = normResume.match(/(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
  let yearsDetected = expMatch ? parseInt(expMatch[1], 10) : 0;

  // If not explicitly "X years of experience", check date ranges (e.g. 2021 - 2024)
  if (!yearsDetected) {
    const yearMatches = resumeText.match(/\b(20[0-2][0-9]|199[0-9])\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map(Number).sort((a, b) => a - b);
      const span = years[years.length - 1] - years[0];
      if (span > 0 && span < 30) {
        yearsDetected = Math.min(span, 15);
      }
    }
  }

  // Detect required experience from JD
  const jdExpMatch = normJD.match(/(\d{1,2})\+?\s*(?:years?|yrs?)/i);
  const yearsRequired = jdExpMatch ? parseInt(jdExpMatch[1], 10) : 1;

  let levelEstimated = 'Entry Level (0-2 years)';
  if (yearsDetected >= 6) {
    levelEstimated = 'Senior / Lead Level (6+ years)';
  } else if (yearsDetected >= 3) {
    levelEstimated = 'Mid Level (3-5 years)';
  }

  const actionVerbs = extractActionVerbs(resumeText);
  const uniqueVerbs = Array.from(new Set(actionVerbs));

  let score = 70;
  if (yearsDetected >= yearsRequired) score += 15;
  if (uniqueVerbs.length >= 8) score += 15;
  else if (uniqueVerbs.length < 3) score -= 15;

  score = Math.max(30, Math.min(100, score));

  let feedback = `Detected approximately ${yearsDetected > 0 ? yearsDetected + '+' : '1-2'} years of professional/project experience (${levelEstimated}). `;
  if (uniqueVerbs.length >= 5) {
    feedback += `Strong impact demonstrated with ${uniqueVerbs.length} action verbs (e.g., ${uniqueVerbs.slice(0, 4).join(', ')}).`;
  } else {
    feedback += `Consider beginning achievement bullets with stronger action verbs (e.g., Engineered, Spearheaded, Accelerated).`;
  }

  return {
    yearsDetected,
    yearsRequired,
    levelEstimated,
    score,
    feedback,
    actionVerbsCount: uniqueVerbs.length,
    strongActionVerbs: uniqueVerbs,
  };
}

/**
 * Calculates ATS Grade based on match score
 */
function getAtsGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'Needs Improvement';
}

/**
 * Generates actionable improvement recommendations
 */
function generateRecommendations(technicalSkills, softSkills, formatting, experience, education) {
  const recommendations = [];

  // 1. Missing Technical Skills (High Priority)
  if (technicalSkills.missing.length > 0) {
    const topMissing = technicalSkills.missing.slice(0, 4).join(', ');
    recommendations.push({
      category: 'Technical Skills',
      priority: 'High',
      title: 'Incorporate Critical Target Technologies',
      description: `The job description strongly emphasizes: ${topMissing}. If you have practical or academic exposure to these, explicitly add them to your Skills section and project bullet points.`,
    });
  }

  // 2. Action Verbs & Metrics (High / Medium Priority)
  if (experience.actionVerbsCount < 6) {
    recommendations.push({
      category: 'Impact & Metrics',
      priority: 'High',
      title: 'Adopt the Google X-Y-Z Achievement Formula',
      description: 'Frame achievements as: "Accomplished [X] as measured by [Y], by doing [Z]". Replace passive phrases like "Responsible for" with dynamic verbs like "Engineered", "Optimized", or "Delivered".',
    });
  } else {
    recommendations.push({
      category: 'Impact & Metrics',
      priority: 'Medium',
      title: 'Quantify Engineering Outcomes',
      description: 'Strengthen existing bullet points by adding concrete figures: latency reduction percentages, query time savings, active user counts, or test coverage gains.',
    });
  }

  // 3. Formatting & ATS Scanability (Medium Priority)
  if (formatting.score < 80) {
    recommendations.push({
      category: 'Formatting & ATS Hygiene',
      priority: 'Medium',
      title: 'Improve Structural Parseability',
      description: formatting.tips[0] || 'Standardize heading labels and ensure contact details (email, phone, LinkedIn) are easily extractable by ATS parsers.',
    });
  }

  // 4. Soft Skills & Cross-Functional Alignment (Low / Medium Priority)
  if (softSkills.missing.length > 0) {
    recommendations.push({
      category: 'Soft Skills & Leadership',
      priority: 'Low',
      title: 'Demonstrate Collaborative Delivery',
      description: `Include evidence of ${softSkills.missing.slice(0, 3).join(', ')} through project leadership, cross-functional collaboration, or code review contributions.`,
    });
  }

  // 5. Keyword Density
  recommendations.push({
    category: 'Keyword Strategy',
    priority: 'Low',
    title: 'Align Role Titles & Domain Terminology',
    description: 'Ensure your resume summary or title reflects the exact or related target job title to maximize keyword frequency matches in screening filters.',
  });

  return recommendations;
}

/**
 * Generates keyword optimization matrix
 */
function generateKeywordSuggestions(technicalSkills, softSkills) {
  const suggestions = [];

  // Technical skills in JD
  technicalSkills.job.forEach((skill) => {
    const isPresent = technicalSkills.matched.includes(skill);
    suggestions.push({
      keyword: skill,
      importance: 'Critical',
      present: isPresent,
      reason: isPresent
        ? 'Matched with core job specification.'
        : 'Crucial technical requirement in job description. ATS may filter candidates without it.',
    });
  });

  // Soft skills in JD
  softSkills.job.forEach((skill) => {
    const isPresent = softSkills.matched.includes(skill);
    suggestions.push({
      keyword: skill,
      importance: 'Recommended',
      present: isPresent,
      reason: isPresent
        ? 'Competency confirmed in resume.'
        : 'Valued organizational competency emphasized by hiring manager.',
    });
  });

  // If few keywords detected in JD, add general industry keywords
  if (suggestions.length < 5) {
    ['Git', 'REST API', 'Unit Testing', 'Agile'].forEach((tech) => {
      suggestions.push({
        keyword: tech,
        importance: 'Recommended',
        present: technicalSkills.resume.map((s) => s.toLowerCase()).includes(tech.toLowerCase()),
        reason: 'Essential baseline competency for modern software engineering teams.',
      });
    });
  }

  return suggestions;
}

/**
 * Optional Gemini LLM enhancement for deep personalized summary and rewrites
 */
async function callGeminiIfAvailable(resumeText, jobDescription, baseAnalysis) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  try {
    const prompt = `You are a Principal Technical Recruiter and ATS Expert.
Given the following Resume and Job Description, provide an executive summary (3-4 sentences), and 2 targeted bullet point rewrite suggestions.
Format as JSON with keys:
{
  "executiveSummary": "string",
  "bulletPointRewrites": [
    { "original": "string", "improved": "string", "reason": "string" }
  ]
}

Resume Text:
${resumeText.slice(0, 2500)}

Job Description:
${jobDescription.slice(0, 1500)}

Response strictly in valid JSON without markdown wrapping.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Using rule-based engine.`);
      return null;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      const parsed = JSON.parse(candidateText);
      return parsed;
    }
  } catch (err) {
    console.warn('Gemini LLM call failed or timed out:', err.message);
  }
  return null;
}

/**
 * Main analysis pipeline
 */
async function runAnalysis(resumeText, jobDescription, jobTitle = 'Software Engineer', companyName = '') {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text is required for analysis');
  }
  if (!jobDescription || jobDescription.trim().length === 0) {
    throw new Error('Job description is required for analysis');
  }

  // 1. Skill Extraction
  const resumeTechSkills = extractSkills(resumeText, TECHNICAL_SKILLS);
  const jobTechSkills = extractSkills(jobDescription, TECHNICAL_SKILLS);

  const matchedTechSkills = jobTechSkills.filter((skill) => resumeTechSkills.includes(skill));
  const missingTechSkills = jobTechSkills.filter((skill) => !resumeTechSkills.includes(skill));

  const resumeSoftSkills = extractSkills(resumeText, SOFT_SKILLS);
  const jobSoftSkills = extractSkills(jobDescription, SOFT_SKILLS);

  const matchedSoftSkills = jobSoftSkills.filter((skill) => resumeSoftSkills.includes(skill));
  const missingSoftSkills = jobSoftSkills.filter((skill) => !resumeSoftSkills.includes(skill));

  // Combined list for general display
  const matchedSkills = [...matchedTechSkills, ...matchedSoftSkills];
  const missingSkills = [...missingTechSkills, ...missingSoftSkills];

  // 2. Formatting & Structure
  const formatting = analyzeFormatting(resumeText);

  // 3. Education Check
  const education = analyzeEducation(resumeText, jobDescription);

  // 4. Experience & Action Verbs
  const experience = analyzeExperience(resumeText, jobDescription);

  // 5. Scoring Weights:
  // Technical Skills (45%), Soft Skills (15%), Experience & Verbs (20%), Education (10%), Formatting (10%)
  const techScore = jobTechSkills.length > 0 ? (matchedTechSkills.length / jobTechSkills.length) * 100 : 75;
  const softScore = jobSoftSkills.length > 0 ? (matchedSoftSkills.length / jobSoftSkills.length) * 100 : 70;
  const expScore = experience.score;
  const eduScore = education.score;
  const formatScore = formatting.score;

  const weightedTotal =
    techScore * 0.45 +
    softScore * 0.15 +
    expScore * 0.20 +
    eduScore * 0.10 +
    formatScore * 0.10;

  const matchScore = Math.max(15, Math.min(98, Math.round(weightedTotal)));
  const atsGrade = getAtsGrade(matchScore);

  const technicalSkills = {
    resume: resumeTechSkills,
    job: jobTechSkills,
    matched: matchedTechSkills,
    missing: missingTechSkills,
  };

  const softSkills = {
    resume: resumeSoftSkills,
    job: jobSoftSkills,
    matched: matchedSoftSkills,
    missing: missingSoftSkills,
  };

  // 6. Recommendations & Keyword Suggestions
  const recommendations = generateRecommendations(technicalSkills, softSkills, formatting, experience, education);
  const keywordSuggestions = generateKeywordSuggestions(technicalSkills, softSkills);

  // 7. Executive Summary
  let executiveSummary = `Your resume achieves an estimated compatibility score of ${matchScore}/100 for the ${jobTitle} role${companyName ? ' at ' + companyName : ''}. `;
  if (matchScore >= 80) {
    executiveSummary += `Strong alignment detected across technical qualifications and experience credentials. Address the remaining ${missingTechSkills.length} missing skill keywords to maximize automated filter bypass.`;
  } else if (matchScore >= 60) {
    executiveSummary += `Good foundational match. Enhancing your alignment with key requirements (${missingTechSkills.slice(0, 3).join(', ') || 'target technologies'}) and adding quantifiable project outcomes will substantially improve recruiter interest.`;
  } else {
    executiveSummary += `Moderate match. The job specification requires specific technical competencies (${missingTechSkills.slice(0, 4).join(', ')}) that are currently missing or under-represented in your resume text.`;
  }

  // 8. Optional LLM Enhancement
  let isAiGenerated = false;
  let engineMode = 'Rule-Based Deterministic ATS Engine';

  const aiResult = await callGeminiIfAvailable(resumeText, jobDescription, { matchScore, technicalSkills });
  if (aiResult && aiResult.executiveSummary) {
    executiveSummary = aiResult.executiveSummary;
    isAiGenerated = true;
    engineMode = 'AI-Enhanced ATS Engine (Gemini LLM)';

    if (aiResult.bulletPointRewrites && Array.isArray(aiResult.bulletPointRewrites)) {
      aiResult.bulletPointRewrites.forEach((rw) => {
        recommendations.unshift({
          category: 'AI Bullet Point Rewrite',
          priority: 'High',
          title: `Optimized: "${rw.original.slice(0, 40)}..."`,
          description: `Recommended: "${rw.improved}" — ${rw.reason}`,
        });
      });
    }
  }

  return {
    matchScore,
    atsGrade,
    breakdown: {
      technicalScore: Math.round(techScore),
      softSkillsScore: Math.round(softScore),
      experienceScore: Math.round(expScore),
      educationScore: Math.round(eduScore),
      formattingScore: Math.round(formatScore),
    },
    matchedSkills,
    missingSkills,
    technicalSkills,
    softSkills,
    education,
    experience,
    formattingFeedback: formatting,
    keywordSuggestions,
    recommendations,
    executiveSummary,
    isAiGenerated,
    engineMode,
  };
}

module.exports = {
  runAnalysis,
  extractSkills,
  analyzeFormatting,
};
