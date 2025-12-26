require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');
const newsletterRoutes = require('./routes/newsletters');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GoC Newsletter Backend' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
