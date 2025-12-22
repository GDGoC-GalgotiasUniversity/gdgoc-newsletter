/**
 * Authentication Routes
 * 
 * Unified login/signup for admin and readers
 * - Admin: Hardcoded credentials (email + password)
 * - Reader: Database stored credentials (dynamic email + password)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');
const router = express.Router();

// Hardcoded admin credentials (from environment variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gdgoc.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /auth/signin
 * 
 * Unified login endpoint for admin and readers
 * 
 * Logic:
 * 1. If email & password match HARDCODED ADMIN → role: 'admin'
 * 2. Else if email & password match USER in DB → role: 'reader'
 * 3. Else → Invalid credentials
 * 
 * Frontend sends: { email, password }
 * 
 * Returns: { success: true, token, role: 'admin'|'reader' }
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

    // STEP 1: Check if credentials match HARDCODED ADMIN
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        {
          email: ADMIN_EMAIL,
          role: 'admin',
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        role: 'admin',
        message: 'Admin login successful',
      });
    }

    // STEP 2: Check if user exists in database (READER LOGIN)
    const user = await User.findOne({ email }).select('+passwordHash');

    if (user) {
      // User exists, verify password
      const isPasswordValid = await user.comparePassword(password);

      if (isPasswordValid) {
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
      } else {
        // Password incorrect
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }

    // STEP 3: User not found in DB and not admin
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
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
 * 
 * Create new reader account
 * 
 * Frontend sends: { email, password, name }
 * 
 * Returns: { success: true, token, role: 'reader' }
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

    // Cannot signup with admin email
    if (email === ADMIN_EMAIL) {
      return res.status(400).json({
        success: false,
        message: 'This email is reserved',
      });
    }

    // Create new reader user
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
 * 
 * Verify JWT token validity
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
 * POST /auth/logout
 * 
 * Logout (frontend deletes token)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
