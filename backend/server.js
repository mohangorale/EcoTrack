require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection (Atlas or fallback)
connectDB();

// Enable CORS for frontend applications
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (API 16)
app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  return res.status(200).json({
    success: true,
    message: 'EcoTrack backend is running',
    database: isMongoConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Storage Mode (Active)',
    mongoReadyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Mount modular route groups (supports both /api/* and root /*)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/items', itemRoutes);
app.use('/items', itemRoutes);

app.use('/api/public', publicRoutes);
app.use('/public', publicRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  return res.status(200).json({
    success: true,
    message: 'EcoTrack backend is running',
    database: isMongoConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Storage Mode (Active)',
    mongoReadyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource ${req.method} ${req.url} not found`,
    errorCode: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred',
    errorCode: 'INTERNAL_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 EcoTrack REST API Service active on port ${PORT}`);
  console.log(`📡 Base URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
