/**
 * Authentication Middleware
 * 
 * Protects admin routes by verifying JWT tokens
 * Used to guard create/edit/delete newsletter routes
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to verify JWT token
 * 
 * Usage in routes:
 *   router.post('/admin/newsletters', verifyToken, createNewsletter);
 * 
 * Returns 401 if token is invalid or missing
 * Calls next() if token is valid
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract from "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request for use in route handlers
    req.user = {
      email: decoded.email,
      role: decoded.role,
    };

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports = verifyToken;
