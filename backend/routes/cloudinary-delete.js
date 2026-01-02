const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

// @route   DELETE /api/cloudinary-delete
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

            const parts = imageUrl.split('/');
            const filenameWithExt = parts[parts.length - 1];
            const folderName = parts[parts.length - 2];
            const filename = filenameWithExt.split('.')[0];

            // Construct public_id based on known folder structure
            // idToDelete = `${folderName}/${filename}`;

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
        console.log('[Cloudinary Delete] Deleting image');

        // Wrap destroy in retry logic
        const result = await retryOperation(() => cloudinary.uploader.destroy(idToDelete, { invalidate: true }));

        console.log('[Cloudinary Delete] Operation result:', result.result);

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
