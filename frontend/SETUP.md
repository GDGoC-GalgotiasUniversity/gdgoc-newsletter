# GDG Newsletter Platform - Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/gdg-newsletter
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdg-newsletter?retryWrites=true&w=majority
```

### 3. Start MongoDB (if using local)
```bash
# On Windows with MongoDB installed
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── newsletters/          # API routes
│   │       ├── route.ts          # GET all, POST create
│   │       └── [slug]/
│   │           └── route.ts      # GET, PUT, DELETE individual
│   ├── newsletter/
│   │   └── [slug]/
│   │       └── page.tsx          # Newsletter detail page
│   ├── admin/
│   │   └── page.tsx              # Admin panel
│   ├── page.tsx                  # Homepage with newsletter list
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── mongodb.ts                # MongoDB connection
│   └── models/
│       └── Newsletter.ts         # Mongoose schema
└── package.json
```

## Features

### Public Pages
- **Homepage** (`/`) - Lists all newsletters with pagination
- **Newsletter Detail** (`/newsletter/[slug]`) - View full newsletter content

### Admin Panel
- **Admin Dashboard** (`/admin`) - Manage all newsletters
  - Create new newsletters
  - View all published newsletters
  - Delete newsletters

## API Endpoints

### GET /api/newsletters
Get all newsletters with pagination
- Query params: `page` (default: 1), `limit` (default: 10)

### POST /api/newsletters
Create a new newsletter
- Body: `{ title, content, excerpt, author }`

### GET /api/newsletters/[slug]
Get a specific newsletter by slug

### PUT /api/newsletters/[slug]
Update a newsletter

### DELETE /api/newsletters/[slug]
Delete a newsletter

## Database Schema

```typescript
Newsletter {
  title: string (required)
  slug: string (unique, auto-generated from title)
  content: string (required)
  excerpt: string (required)
  author: string (required)
  publishedAt: Date (default: now)
  featured: boolean (default: false)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

Make sure to set the `MONGODB_URI` environment variable in Vercel dashboard.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env.local`
- Verify network access if using MongoDB Atlas

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```
