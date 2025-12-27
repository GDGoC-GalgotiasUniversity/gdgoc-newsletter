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

// Routes configuration

// Mount Auth at /api/auth -> results in /api/auth/signin
app.use('/api/auth', authRoutes);

// Mount Newsletters at root -> results in /api/newsletters (as defined in the router file)
app.use('/', newsletterRoutes);

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
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});