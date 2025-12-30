const mongoose = require('mongoose');

/**
 * Newsletter Schema
 * 
 * Fields:
 * - title: Newsletter title (required)
 * - slug: URL-friendly identifier, must be unique (required)
 * - excerpt: Short summary of newsletter (optional)
 * - contentMarkdown: Main content in Markdown format (required)
 * - template: Newsletter template type (required)
 * - status: "draft" or "published" (default: "draft")
 * - publishedAt: Timestamp when newsletter was published
 * - createdAt: Timestamp when newsletter was created
 * 
 * Rules (NON-NEGOTIABLE):
 * - Every newsletter MUST have a schema
 * - Slug MUST be unique (DB-enforced)
 * - No deep nesting
 * - No random or temporary fields
 * - No storing frontend state in DB
 * - Each newsletter must have its own URL
 */

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Newsletter title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'],
      minlength: [3, 'Slug must be at least 3 characters long'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    contentMarkdown: {
      type: String,
      required: [true, 'Newsletter content is required'],
      minlength: [10, 'Content must be at least 10 characters long'],
    },
    template: {
      type: String,
      required: [true, 'Template type is required'],
      enum: {
        values: ['event-recap', 'workshop', 'announcement', 'default'],
        message: 'Template must be one of: event-recap, workshop, announcement, or default',
      },
      default: 'default',
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: 'Status must be either "draft" or "published"',
      },
      default: 'draft',
    },
    coverImage: {
      type: String,
      default: null,
    },
    gallery: {
      type: [String],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Middleware: Set publishedAt when status changes to "published"
 */
newsletterSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

/**
 * Index for slug - ensures uniqueness at DB level
 */
newsletterSchema.index({ slug: 1 }, { unique: true });

/**
 * Index for status - optimizes queries for published newsletters
 */
newsletterSchema.index({ status: 1 });

/**
 * Index for createdAt - optimizes sorting by creation date
 */
newsletterSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
