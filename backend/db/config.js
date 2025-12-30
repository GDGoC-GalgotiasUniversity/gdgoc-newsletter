/**
 * Database Configuration & Setup
 * 
 * This file contains all database-related configurations
 * and initializations
 */

module.exports = {
  // Connection configuration
  connection: require('./connection'),

  // Models
  models: require('./models'),

  // Validation rules
  rules: {
    password: {
      minLength: 6,
    },
    slug: {
      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      description: 'Lowercase letters, numbers, and hyphens only',
    },
    email: {
      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      description: 'Valid email format required',
    },
  },

  // Collections documentation
  collections: {
    users: {
      description: 'Stores admin and reader user accounts',
      schema: {
        _id: 'MongoDB auto-generated ID',
        name: 'User full name (required)',
        email: 'User email, must be unique (required)',
        passwordHash: 'Bcrypt-hashed password (required)',
        role: 'admin or reader (default: reader)',
        createdAt: 'Timestamp',
        updatedAt: 'Timestamp',
      },
    },
    newsletters: {
      description: 'Stores all newsletters with Markdown content',
      schema: {
        _id: 'MongoDB auto-generated ID',
        title: 'Newsletter title (required)',
        slug: 'URL-friendly identifier, must be unique (required)',
        excerpt: 'Short summary (optional)',
        contentMarkdown: 'Markdown content (required)',
        template: 'Template type (required)',
        status: 'draft or published (default: draft)',
        publishedAt: 'Timestamp when published',
        createdAt: 'Timestamp',
        updatedAt: 'Timestamp',
      },
    },
  },
};
