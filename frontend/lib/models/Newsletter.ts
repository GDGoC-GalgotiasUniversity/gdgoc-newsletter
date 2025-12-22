import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
