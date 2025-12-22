/**
 * Database Models Index
 * 
 * This file exports all Mongoose models for easy importing
 * throughout the application
 */

const User = require('./User');
const Newsletter = require('./Newsletter');

module.exports = {
  User,
  Newsletter,
};
