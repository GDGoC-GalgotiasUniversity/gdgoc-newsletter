const jwt = require('jsonwebtoken');

// 1. Verify Token (Authentication)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: No Token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; // Attaches { userId, role } to the request
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// 2. Verify Admin (Authorization)
const verifyAdmin = (req, res, next) => {
  // We assume verifyToken has already run, so req.user exists
  if (req.user && req.user.role === 'admin') {
    next(); // Proceed
  } else {
    res.status(403).json({ success: false, message: 'Access Denied: Beta, tumse na ho payega' });
  }
};

module.exports = { verifyToken, verifyAdmin };