// backend/repair-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./db/models/User');

const repair = async () => {
  try {
    // 1. Connect to Database
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected.");

    const adminEmail = "gdgocgu@gmail.com";

    // 2. FORCE DELETE the old admin
    console.log(`🗑️  Searching for old admin: ${adminEmail}...`);
    const deleted = await User.deleteMany({ email: adminEmail });
    console.log(`💥 Deleted ${deleted.deletedCount} old admin record(s).`);

    // 3. CREATE the new admin (Correct Schema)
    console.log("🛠️  Creating fresh Admin account...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const newAdmin = new User({
      name: "GDG Master Admin",
      email: adminEmail,
      password: hashedPassword, // Storing as 'password' (NEW Schema)
      role: "admin"
    });

    await newAdmin.save();
    console.log("✨ SUCCESS! Admin account repaired.");
    console.log("-------------------------------------");
    console.log("📧 Login Email:    " + adminEmail);
    console.log("🔑 Login Password: admin123");
    console.log("-------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

repair();