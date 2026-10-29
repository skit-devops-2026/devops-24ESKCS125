require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { getEmail } = require('./sessionStore');

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const noteRoutes = require('./routes/noteRoutes');
const examRoutes = require('./routes/examRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const focusRoutes = require('./routes/focusRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Disable Mongoose command buffering so queries fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Data APIs are always scoped to the signed-in account.
app.use('/api/tasks', (req, res, next) => {
  const token = req.get('x-auth-token');
  const email = getEmail(token);
  if (!email) return res.status(401).json({ error: 'Your session expired. Please log in again.' });
  req.userEmail = email;
  next();
});
app.use('/api/subjects', (req, res, next) => {
  const token = req.get('x-auth-token');
  const email = getEmail(token);
  if (!email) return res.status(401).json({ error: 'Your session expired. Please log in again.' });
  req.userEmail = email;
  next();
});
app.use('/api/notes', (req, res, next) => {
  const token = req.get('x-auth-token');
  const email = getEmail(token);
  if (!email) return res.status(401).json({ error: 'Your session expired. Please log in again.' });
  req.userEmail = email;
  next();
});
app.use('/api/exams', (req, res, next) => {
  const token = req.get('x-auth-token');
  const email = getEmail(token);
  if (!email) return res.status(401).json({ error: 'Your session expired. Please log in again.' });
  req.userEmail = email;
  next();
});
app.use('/api/calendar', (req, res, next) => {
  const token = req.get('x-auth-token');
  const email = getEmail(token);
  if (!email) return res.status(401).json({ error: 'Your session expired. Please log in again.' });
  req.userEmail = email;
  next();
});
app.use('/api/focus', (req, res, next) => {
  const token = req.get('x-auth-token');
  const email = getEmail(token);
  if (!email) return res.status(401).json({ error: 'Your session expired. Please log in again.' });
  req.userEmail = email;
  next();
});

// Serve static frontend files (HTML, CSS, JS) directly from project root
app.use(express.static(ROOT_DIR));

// Health Check API
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    service: 'Study Planner API',
    mongodb: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Graceful offline middleware for data routes when MongoDB is not connected
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || req.path.startsWith('/auth')) {
    return next();
  }
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  if (req.method === 'GET') {
    return res.json([]);
  }
  return res.json({ success: true, offline: true });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/focus', focusRoutes);

// Root route -> index.html (Login)
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Friendly URL rewrites (e.g. /dashboard -> dashboard.html, /task -> task.html)
app.get('/:page', (req, res, next) => {
  const pageFile = `${req.params.page}.html`;
  const filePath = path.join(ROOT_DIR, pageFile);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  next();
});

// Start Server with automatic port fallback
function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`===============================================`);
    console.log(`🚀 Study Planner Server running on port ${portToTry}`);
    console.log(`🔗 App URL:   http://localhost:${portToTry}`);
    console.log(`📊 Dashboard: http://localhost:${portToTry}/dashboard.html`);
    console.log(`🩺 Health:    http://localhost:${portToTry}/api/health`);
    console.log(`===============================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${portToTry} is in use, trying port ${Number(portToTry) + 1}...`);
      startServer(Number(portToTry) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(Number(PORT));
