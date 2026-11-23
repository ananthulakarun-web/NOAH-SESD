const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const User = require('./models/User');

// Route imports
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images/files to be accessed
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local development ease
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Serve uploaded files statically if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'ResumeAI REST API',
    version: '1.0.0',
    status: 'Operational',
    documentation: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    engine: process.env.GEMINI_API_KEY ? 'Hybrid (Gemini AI + Rule-Based ATS)' : 'Deterministic Rule-Based ATS Engine',
    database: 'Connected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Seed Default Accounts for Testing/Presentation
const seedInitialData = async () => {
  try {
    const adminEmail = 'admin@resumeai.com';
    const demoEmail = 'demo@resumeai.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        username: 'Admin System',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        title: 'Platform Administrator',
        bio: 'Managing ResumeAI algorithms, user accounts, and platform health.',
      });
      console.log(`[Seed] Created default Administrator: ${adminEmail} (password: admin123)`);
    }

    const existingDemo = await User.findOne({ email: demoEmail });
    if (!existingDemo) {
      await User.create({
        username: 'Alex Morgan',
        email: demoEmail,
        password: 'demo123',
        role: 'user',
        title: 'Full-Stack Software Engineer',
        bio: 'Passionate computer science graduate specializing in modern web architecture.',
      });
      console.log(`[Seed] Created default Demo Candidate: ${demoEmail} (password: demo123)`);
    }
  } catch (err) {
    console.warn('[Seed] Note during auto-seed:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

// Start Server after connecting to Database
const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 ResumeAI Backend running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api/health`);
      console.log(`🔒 Security: JWT Auth + BCrypt + Helmet + Rate Limiter`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server if not imported for tests
if (require.main === module) {
  startServer();
}

module.exports = app;
