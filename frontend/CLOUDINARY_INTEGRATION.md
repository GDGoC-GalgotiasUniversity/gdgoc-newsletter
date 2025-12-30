# Cloudinary Integration Guide

## Overview
Cloudinary image upload is now fully integrated into the newsletter editor. Admins can upload images directly while creating/editing newsletters.

## Features Added

### 1. **Cloudinary Upload Button in Editor Toolbar**
- Cloud icon (☁️) button in the editor toolbar
- Click to open upload modal
- Upload image → Automatically inserts into content
- No need to manually copy/paste URLs

### 2. **Cover Image Uploader**
- Dedicated section for uploading newsletter cover images
- Drag-and-drop support
- Real-time preview
- Recommended size: 1200x630px

### 3. **Image Link Generator**
- Separate tool to upload images and get direct links
- Copy links to clipboard
- Perfect for batch uploading images
- Use links anywhere in your content

## How to Use

### Adding Images to Newsletter Content

**Method 1: Direct Upload (Recommended)**
1. Click the ☁️ (cloud) button in the editor toolbar
2. Select an image file
3. Image automatically uploads and inserts into content
4. Continue editing

**Method 2: Paste URL**
1. Click the 🖼️ (image) button in the editor toolbar
2. Paste image URL
3. Click "Apply"

**Method 3: Image Link Generator**
1. Scroll to "Image Link Generator" section
2. Upload image
3. Copy the link
4. Paste in editor using Method 2

### Uploading Cover Image

1. In the "Cover Image" section, click the upload area
2. Select an image file
3. Image uploads to Cloudinary
4. Preview appears below
5. Cover image is set automatically

## File Structure

```
frontend/components/
├── NewsletterEditor.tsx          # Main editor with Cloudinary integration
├── CloudinaryImageButton.tsx     # Cloud upload button component
├── ImageUploader.tsx             # Cover image uploader
├── ImageLinkGenerator.tsx        # Standalone image link tool
└── ...
```

## Backend Integration

### Upload Endpoint
```
POST /api/cloudinary-upload
Content-Type: multipart/form-data

Body:
- image: File (image file)

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "gdgoc-newsletter/..."
}
```

### Backend Route
- File: `backend/routes/cloudinary-upload.js`
- Handles image upload to Cloudinary
- Returns permanent image URLs

## Configuration

### Environment Variables

**Backend (.env)**
```
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (.env)**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Image Specifications

### Supported Formats
- PNG
- JPG/JPEG
- GIF
- WebP

### Size Limits
- Maximum file size: 10MB
- Recommended cover image: 1200x630px
- Recommended content images: 800x600px or larger

### Optimization
- Cloudinary automatically optimizes images
- Images are served with CDN for fast loading
- Automatic format conversion for best performance

## Workflow Example

### Creating a Newsletter with Images

1. **Go to Admin → Create Newsletter**
   - URL: `http://localhost:3001/admin/new`

2. **Fill Basic Info**
   - Title: "Web Development Workshop"
   - Slug: "web-dev-workshop"
   - Summary: "Learn modern web development"

3. **Upload Cover Image**
   - Click cover image uploader
   - Select image file
   - Image uploads to Cloudinary
   - Preview appears

4. **Write Content**
   - Click ☁️ button to upload images
   - Or use 🖼️ button to paste URLs
   - Format text with toolbar buttons
   - Add headings, lists, quotes

5. **Insert Images**
   - Click ☁️ button in toolbar
   - Upload image
   - Image automatically inserts
   - Continue writing

6. **Publish**
   - Set status to "Published"
   - Click "Publish"
   - Newsletter goes live with all images

## Troubleshooting

### Image won't upload?
- Check file size (max 10MB)
- Ensure it's a valid image format
- Check internet connection
- Verify Cloudinary credentials in `.env`

### Image not appearing in content?
- Check image URL is correct
- Verify Cloudinary account is active
- Check browser console for errors

### Upload button not working?
- Refresh the page
- Check browser console for errors
- Verify API endpoint is accessible

## Performance Tips

1. **Compress Images Before Upload**
   - Use tools like TinyPNG or ImageOptim
   - Reduces file size and upload time

2. **Use Appropriate Sizes**
   - Cover images: 1200x630px
   - Content images: 800x600px or larger
   - Avoid very large images

3. **Batch Upload**
   - Use Image Link Generator for multiple images
   - Upload all images first
   - Then paste links in content

## Security

- API credentials stored in `.env` (never committed to git)
- Images uploaded to Cloudinary (secure cloud storage)
- URLs are permanent and always accessible
- No sensitive data in image URLs

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Cloudinary documentation: https://cloudinary.com/documentation
3. Check backend logs for upload errors
4. Verify environment variables are set correctly
