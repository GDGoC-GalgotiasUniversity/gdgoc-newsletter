/**
 * Newsletter Routes
 * 
 * Public routes:
 *   GET /api/newsletters - Get all published newsletters
 *   GET /api/newsletters/:slug - Get single newsletter by slug
 * 
 * Admin-only routes (requires JWT token):
 *   POST /admin/newsletters - Create newsletter
 *   PUT /admin/newsletters/:id - Edit newsletter
 *   DELETE /admin/newsletters/:id - Delete newsletter
 */

const express = require('express');
const verifyToken = require('../middleware/auth');
const { Newsletter } = require('../db/models');

const router = express.Router();

/**
 * PUBLIC ROUTES (No authentication required)
 */

/**
 * GET /api/newsletters
 * Get all published newsletters
 */
router.get('/api/newsletters', async (req, res) => {
  try {
    const newsletters = await Newsletter.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: newsletters.length,
      data: newsletters,
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching newsletters',
    });
  }
});

/**
 * GET /api/newsletters/:slug
 * Get single newsletter by slug
 */
router.get('/api/newsletters/:slug', async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne({ slug: req.params.slug });

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    // Only return published newsletters to public
    if (newsletter.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    res.json({
      success: true,
      data: newsletter,
    });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching newsletter',
    });
  }
});

/**
 * ADMIN-ONLY ROUTES (Requires JWT token with admin role)
 */

/**
 * POST /admin/newsletters
 * Create new newsletter (admin only)
 * 
 * Body:
 * {
 *   title: string,
 *   slug: string,
 *   excerpt: string (optional),
 *   contentMarkdown: string,
 *   template: "event-recap" | "workshop" | "announcement" | "default",
 *   status: "draft" | "published" (default: draft)
 * }
 */
router.post('/admin/newsletters', verifyToken, async (req, res) => {
  try {
    const { title, slug, excerpt, contentMarkdown, template, status } = req.body;

    // Validate required fields
    if (!title || !slug || !contentMarkdown || !template) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, slug, contentMarkdown, template',
      });
    }

    // Create newsletter
    const newsletter = await Newsletter.create({
      title,
      slug,
      excerpt,
      contentMarkdown,
      template,
      status: status || 'draft',
    });

    res.status(201).json({
      success: true,
      message: 'Newsletter created successfully',
      data: newsletter,
    });
  } catch (error) {
    console.error('Error creating newsletter:', error);

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Slug "${error.keyValue.slug}" already exists`,
      });
    }

    // Handle validation errors
    if (error.errors) {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating newsletter',
    });
  }
});

/**
 * PUT /admin/newsletters/:id
 * Edit existing newsletter (admin only)
 */
router.put('/admin/newsletters/:id', verifyToken, async (req, res) => {
  try {
    const { title, slug, excerpt, contentMarkdown, template, status } = req.body;

    // Get current newsletter to check if status is changing to published
    const currentNewsletter = await Newsletter.findById(req.params.id);
    
    if (!currentNewsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    // Prepare update object
    const updateData = {
      title,
      slug,
      excerpt,
      contentMarkdown,
      template,
      status,
    };

    // If status is being changed to "published" and publishedAt is not yet set, set it
    if (status === 'published' && !currentNewsletter.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // Find and update newsletter
    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return updated doc and validate
    );

    res.json({
      success: true,
      message: 'Newsletter updated successfully',
      data: newsletter,
    });
  } catch (error) {
    console.error('Error updating newsletter:', error);

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Slug "${error.keyValue.slug}" already exists`,
      });
    }

    // Handle validation errors
    if (error.errors) {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating newsletter',
    });
  }
});

/**
 * DELETE /admin/newsletters/:id
 * Delete newsletter (admin only)
 */
router.delete('/admin/newsletters/:id', verifyToken, async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    res.json({
      success: true,
      message: 'Newsletter deleted successfully',
      data: newsletter,
    });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting newsletter',
    });
  }
});

module.exports = router;
