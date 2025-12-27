/**
 * Authentication Routes
 * * Unified login/signup for all users (admin and reader roles)
 * - All users stored in MongoDB with role field
 * - Admin users created via database (not hardcoded)
 * - Role-based access control at route level
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../db/models'); // utilizing the index export
const verifyToken = require('../middleware/auth'); // Preserved for admin routes

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /auth/signin
 * * Login endpoint for all users (admin and reader roles determined by role field)
 * * Logic:
 * 1. Find user by email in database
 * 2. Verify password hash
 * 3. Return JWT token with user role
 * * Frontend sends: { email, password }
 * * Returns: { success: true, token, role: 'admin'|'reader' }
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if user exists in database and include password hash
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token with user role
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        userId: user._id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      userId: user._id,
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful`,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Sign in failed',
    });
  }
});

/**
 * POST /auth/signup
 * * Create new reader account
 * * Frontend sends: { email, password, name }
 * * Returns: { success: true, token, role: 'reader' }
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user (readers signup with reader role)
    const newUser = await User.create({
      name,
      email,
      passwordHash: password,
      role: 'reader',
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        email: newUser.email,
        role: newUser.role,
        userId: newUser._id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      role: 'reader',
      name: newUser.name,
      email: newUser.email,
      userId: newUser._id,
      message: 'Reader account created successfully',
    });
  } catch (error) {
    console.error('Sign up error:', error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Handle validation errors
    if (error.errors) {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Sign up failed',
    });
  }
});

/**
 * POST /auth/verify
 * * Verify JWT token validity
 */
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      role: decoded.role,
      email: decoded.email,
      message: 'Token is valid',
    });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});

/**
 * GET /api/auth/users
 * Get all users (admin only)
 * RESTORED FROM PREVIOUS VERSION
 */
router.get('/users', verifyToken, async (req, res) => {
  try {
    console.log('👥 Admin fetching all users...');
    
    const users = await User.find()
      .select('-passwordHash') // Don't return password hashes
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${users.length} users`);
    
    res.json({
      success: true,
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
    });
  }
});

/**
 * GET /api/auth/users/public
 * Get all users (public - no auth required)
 * RESTORED FROM PREVIOUS VERSION
 */
router.get('/users/public', async (req, res) => {
  try {
    console.log('👥 Fetching all users (public)...');
    
    const users = await User.find()
      .select('-passwordHash') // Don't return password hashes
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${users.length} users`);
    
    res.json({
      success: true,
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
    });
  }
});

module.exports = router;