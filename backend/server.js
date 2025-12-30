require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');

// Import Routes
const newsletterRoutes = require('./routes/newsletters');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  res.setHeader('X-Developer-Note', 'Don ko pakadna mushkil hi nahi, namumkin hai');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes configuration

// Mount Auth at /api/auth -> results in /api/auth/signin
app.use('/api/auth', authRoutes);

// Mount Newsletters at root -> results in /api/newsletters (as defined in the router file)
// Mount Newsletters at root -> results in /api/newsletters
app.use('/', newsletterRoutes);

// Upload Route
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);


// Cloudinary Upload Route
const cloudinaryUploadRoutes = require('./routes/cloudinary-upload');
app.use('/api/cloudinary-upload', cloudinaryUploadRoutes);

// Serve Static Uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base route
app.get('/', (req, res) => {
  res.send('GDG On Campus Newsletter API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    devMessage: 'Khopdi tod saale ka! (Something went wrong internally)',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});