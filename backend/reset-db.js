// backend/reset-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/connection');
const User = require('./db/models/User');

const reset = async () => {
  await connectDB();
  
  try {
    console.log("🗑️  Deleting all users...");
    await User.deleteMany({}); // This wipes all users
    console.log("✅ All users deleted.");
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

reset();