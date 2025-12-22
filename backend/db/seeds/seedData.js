/**
 * Example seed data for development and testing
 * DO NOT use in production
 * 
 * Usage:
 * node db/seeds/seedData.js
 */

const mongoose = require('mongoose');
const connectDB = require('../connection');
const { User, Newsletter } = require('../models');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Newsletter.deleteMany({});
    console.log('✅ Cleared existing data');

    // Seed users (READERS ONLY - admin is hardcoded in .env)
    const users = await User.create([
      {
        name: 'Reader User One',
        email: 'reader1@gdgoc.com',
        passwordHash: 'reader123456',
        role: 'reader',
      },
      {
        name: 'Reader User Two',
        email: 'reader2@gdgoc.com',
        passwordHash: 'reader123456',
        role: 'reader',
      },
    ]);
    console.log('✅ Created sample reader users');

    // Seed newsletters
    const newsletters = await Newsletter.create([
      {
        title: 'Cloud Study Jams - Query Session',
        slug: 'cloud-study-jams-query-session',
        excerpt: 'Learn about Cloud SQL and querying basics',
        contentMarkdown: `## Session Highlights

This session helped students understand cloud basics.

### Topics Covered
- Google Cloud Compute Engine
- Identity and Access Management (IAM)
- Cloud Architecture Basics

> Learning starts with asking questions.

### Key Takeaways
1. Cloud infrastructure scales automatically
2. Security-first approach is essential
3. Cost optimization matters`,
        template: 'workshop',
        status: 'published',
      },
      {
        title: 'Android Development Workshop',
        slug: 'android-development-workshop',
        excerpt: 'Build your first Android app with Kotlin',
        contentMarkdown: `## Workshop Overview

In this workshop, we covered the fundamentals of Android app development using Kotlin.

### What We Built
- Simple Todo App
- Network requests integration
- Local database storage

### Resources
- [Android Developer Docs](https://developer.android.com)
- [Kotlin Official Guide](https://kotlinlang.org)`,
        template: 'event-recap',
        status: 'published',
      },
      {
        title: 'Upcoming ML Study Jams',
        slug: 'upcoming-ml-study-jams',
        excerpt: 'Machine Learning fundamentals course announcement',
        contentMarkdown: `## 📢 Announcement

We are excited to announce our new **Machine Learning Study Jams** series!

### Schedule
- **Start Date**: January 15, 2025
- **Duration**: 6 weeks
- **Sessions**: Every Tuesday at 6 PM IST

### Prerequisites
- Basic Python knowledge
- Enthusiasm to learn

### Registration
Sign up at [https://gdgoc.com/ml-study-jams](https://gdgoc.com/ml-study-jams)`,
        template: 'announcement',
        status: 'draft',
      },
    ]);
    console.log('✅ Created sample newsletters');

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Newsletters: ${newsletters.length}`);
    console.log(`   Published Newsletters: ${newsletters.filter(n => n.status === 'published').length}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
