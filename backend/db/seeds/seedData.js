const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    // 1. Check if Admin already exists
    const adminEmail = "gdgocgu@gmail.com"; // CHANGE THIS to your preferred admin email
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('🛡️  Admin account already exists.');
      return;
    }

    // 2. Create Admin if not exists
    console.log('🛡️  Creating Master Admin account...');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt); // CHANGE THIS password

    const newAdmin = new User({
      name: "GDG Master Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin" // <--- This is the magic key
    });

    await newAdmin.save();
    console.log('✅ Admin account created successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

module.exports = seedAdmin;