const Newsletter = require('../models/Newsletter');

const seedNewsletters = async () => {
  try {
    // Check if newsletters already exist
    const count = await Newsletter.countDocuments();
    if (count > 0) {
      console.log('📰 Newsletters already exist in database.');
      return;
    }

    console.log('📰 Creating sample newsletters...');

    const newsletters = [
      {
        title: 'Welcome to GDG On Campus Newsletter',
        slug: 'welcome-to-gdg',
        excerpt: 'Your first step into the world of Google Developer Groups',
        contentMarkdown: `# Welcome to GDG On Campus

We're excited to have you here! This is the official newsletter for Google Developer Groups On Campus.

## What is GDG?
Google Developer Groups are community groups for college and university students interested in Google technologies.

## What You'll Learn
- Latest Google technologies
- Web development best practices
- Mobile app development
- Cloud computing with Google Cloud
- And much more!

Stay tuned for upcoming events and workshops.`,
        template: 'announcement',
        status: 'published',
        coverImage: null,
        publishedAt: new Date()
      },
      {
        title: 'Web Development Workshop Recap',
        slug: 'web-dev-workshop-recap',
        excerpt: 'Highlights from our recent web development workshop',
        contentMarkdown: `# Web Development Workshop Recap

Thank you all for attending our web development workshop!

## Topics Covered
- HTML5 and CSS3 fundamentals
- JavaScript ES6+ features
- React basics
- Building responsive websites

## Key Takeaways
1. Modern web development requires understanding of multiple technologies
2. Practice is key to mastering web development
3. Community support helps you grow faster

## Next Workshop
Join us next month for "Advanced React Patterns"!`,
        template: 'event-recap',
        status: 'published',
        coverImage: null,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Cloud Computing Fundamentals',
        slug: 'cloud-computing-fundamentals',
        excerpt: 'Learn the basics of cloud computing with Google Cloud',
        contentMarkdown: `# Cloud Computing Fundamentals

Cloud computing is transforming how we build and deploy applications.

## What is Cloud Computing?
Cloud computing provides on-demand access to computing resources over the internet.

## Benefits
- Scalability
- Cost-effectiveness
- Reliability
- Security
- Global reach

## Google Cloud Services
- Compute Engine
- App Engine
- Cloud Functions
- Cloud Storage
- BigQuery

Start your cloud journey today!`,
        template: 'workshop',
        status: 'published',
        coverImage: null,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Upcoming Events This Month',
        slug: 'upcoming-events-this-month',
        excerpt: 'Check out all the exciting events happening this month',
        contentMarkdown: `# Upcoming Events This Month

We have an exciting lineup of events for you!

## Events Schedule

### Monday - Web Development Basics
Time: 6:00 PM - 8:00 PM
Location: Tech Lab

### Wednesday - Mobile App Development
Time: 5:00 PM - 7:00 PM
Location: Innovation Hub

### Friday - AI/ML Workshop
Time: 4:00 PM - 6:00 PM
Location: Main Auditorium

## How to Register
Visit our website or click the registration link in the event details.

See you there!`,
        template: 'announcement',
        status: 'published',
        coverImage: null,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    await Newsletter.insertMany(newsletters);
    console.log(`✅ ${newsletters.length} sample newsletters created successfully!`);

  } catch (error) {
    console.error('❌ Error seeding newsletters:', error);
  }
};

module.exports = seedNewsletters;
