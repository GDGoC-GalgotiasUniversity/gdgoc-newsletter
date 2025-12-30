# GDG On Campus – Newsletter Platform

A public newsletter platform for GDG On Campus, Galgotias University.

## What this project does
- Public newsletter website
- Each newsletter has its own URL
- Admins can publish newsletters
- Built with Node.js + MongoDB
- Image hosting with Cloudinary

## Tech Stack
Frontend: Next.js + Tailwind  
Backend: Node.js + Express  
Database: MongoDB + Mongoose  
Image Hosting: Cloudinary

## Project status
Initial setup and architecture phase.
Refer to the shared Notion Docs for more help regarding development

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
``` 