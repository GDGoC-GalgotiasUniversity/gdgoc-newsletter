/**
 * Example Server Setup
 * 
 * Shows how to use auth routes and newsletter routes together
 * Copy this into server.js
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./db/connection');
const authRoutes = require('./routes/auth');
const newsletterRoutes = require('./routes/newsletters');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);        // Login, logout, verify token
app.use('/', newsletterRoutes);      // Public & admin newsletter routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'GDG Newsletter API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signin: 'POST /auth/signin - Login (admin or reader)',
        signup: 'POST /auth/signup - Create reader account',
        verify: 'POST /auth/verify - Verify token',
        logout: 'POST /auth/logout - Logout',
      },
      public: {
        getAllNewsletters: 'GET /api/newsletters - Get all published newsletters',
        getNewsletter: 'GET /api/newsletters/:slug - Get single newsletter',
      },
      adminOnly: {
        createNewsletter: 'POST /admin/newsletters - Create newsletter',
        editNewsletter: 'PUT /admin/newsletters/:id - Edit newsletter',
        deleteNewsletter: 'DELETE /admin/newsletters/:id - Delete newsletter',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
