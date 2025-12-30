# Cloudinary Image Upload Setup

## Overview
The newsletter application now uses Cloudinary for image uploads instead of local file storage. This provides better performance, reliability, and scalability.

## Configuration

### Backend Setup
The backend is configured with Cloudinary credentials in `backend/.env`:

```
CLOUDINARY_URL=cloudinary://263155869684988:mAHsnIHLHao-VleZ8VPwvhDNrFk@dei41tczy
CLOUDINARY_CLOUD_NAME=dei41tczy
CLOUDINARY_API_KEY=263155869684988
CLOUDINARY_API_SECRET=mAHsnIHLHao-VleZ8VPwvhDNrFk
```

### Frontend Setup
The frontend is configured with Cloudinary cloud name in `frontend/.env`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dei41tczy
```

## How It Works

### 1. Image Upload Flow
1. User selects an image in the newsletter editor
2. Image is uploaded to backend via `/api/cloudinary-upload` endpoint
3. Backend uploads image to Cloudinary
4. Cloudinary returns secure URL
5. URL is stored in the newsletter's `coverImage` field

### 2. Image Display
- Cover images are displayed in newsletter cards and detail pages
- Images are served from Cloudinary CDN for fast loading
- Automatic image optimization (quality, format, size)

### 3. Image Storage
- All images are stored in the `gdgoc-newsletter` folder on Cloudinary
- Images are automatically optimized for web
- Secure URLs are used for all image references

## Us