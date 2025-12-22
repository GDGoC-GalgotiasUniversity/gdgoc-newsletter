const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * 
 * Fields:
 * - name: User's full name (required)
 * - email: User's email, must be unique (required)
 * - passwordHash: Hashed password using bcrypt (required)
 * - role: User role - either "admin" or "reader" (default: "reader")
 * - createdAt: Timestamp when user was created
 * 
 * Rules:
 * - Email must be unique and valid
 * - Password should never be stored in plain text
 * - Role is strictly limited to enum values
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password hash by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'reader'],
        message: 'Role must be either "admin" or "reader"',
      },
      default: 'reader',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Hash password before saving (middleware)
 * Only hash if password is modified
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare password with hash
 */
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
