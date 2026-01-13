require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Import Routes
const newsletterRoutes = require('./routes/newsletters');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
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

// Cloudinary Delete Route
const cloudinaryDeleteRoutes = require('./routes/cloudinary-delete');
app.use('/api/cloudinary-delete', cloudinaryDeleteRoutes);

// Subscribers Route
const subscriberRoutes = require('./routes/subscribers');
app.use('/api/subscribers', subscriberRoutes);

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