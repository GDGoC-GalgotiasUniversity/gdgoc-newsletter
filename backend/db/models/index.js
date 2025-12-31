/**
 * Database Models Index
 * 
 * This file exports all Mongoose models for easy importing
 * throughout the application
 */

const Newsletter = require('./Newsletter');
const User = require('./User');
const Subscriber = require('./Subscriber');

module.exports = {
  Newsletter,
  User,
  Subscriber,
};
