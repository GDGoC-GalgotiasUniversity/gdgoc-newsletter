const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function for retrying operations
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Operation failed, retrying (${i + 1}/${maxRetries})... Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// @route   POST /api/cloudinary-upload
// @desc    Upload an image to Cloudinary
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary with retry
    const result = await retryOperation(() => new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gdgoc-newsletter',
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    }));

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
});

// @route   DELETE /api/cloudinary-upload
// @desc    Delete an image from Cloudinary
// @access  Public
router.delete('/', async (req, res) => {
  try {
    const { imageUrl, publicId } = req.body;

    if (!imageUrl && !publicId) {
      return res.status(400).json({
        success: false,
        message: 'Image URL or Public ID is required'
      });
    }

    let idToDelete = publicId;

    // If only URL is provided, extract public_id
    if (!idToDelete && imageUrl) {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1614028020/gdgoc-newsletter/sample.jpg
      // We need: gdgoc-newsletter/sample

      const parts = imageUrl.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const folderName = parts[parts.length - 2];
      const filename = filenameWithExt.split('.')[0];

      // Construct public_id based on known folder structure
      // This is a simple extraction assuming standard Cloudinary URL structure
      // For more robust extraction, regex might be needed, but this works for the "folder/file" pattern
      idToDelete = `${folderName}/${filename}`;

      // Handle versioning edge case if folderName is actually a version (projects vary)
      // If folderName starts with 'v' and is numeric, we might need to look further back
      // But based on upload config: folder: 'gdgoc-newsletter', it should be consistent.

      // BETTER APPROACH: Regex to match from folder name onwards
      const regex = /gdgoc-newsletter\/[^.]+/;
      const match = imageUrl.match(regex);
      if (match) {
        idToDelete = match[0];
      }
    }

    if (!idToDelete) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract public_id from URL'
      });
    }

    // Log the extracted ID for debugging
    console.log(`[Cloudinary Delete] Attempting to delete public_id: ${idToDelete}`);

    // Wrap destroy in retry logic
    const result = await retryOperation(() => cloudinary.uploader.destroy(idToDelete, { invalidate: true }));

    console.log(`[Cloudinary Delete] Result for ${idToDelete}:`, result);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      throw new Error(result.result || 'Deletion failed');
    }

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Delete failed'
    });
  }
});

module.exports = router;
