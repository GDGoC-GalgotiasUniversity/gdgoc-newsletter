/**
 * Newsletter Routes
 * * PUBLIC ROUTES (Open to everyone):
 * - GET /api/newsletters        -> Get all PUBLISHED newsletters
 * - GET /api/newsletters/:slug  -> Get single PUBLISHED newsletter
 * * ADMIN ROUTES (Requires Token + Admin Role):
 * - GET /admin/newsletters/all  -> Get ALL newsletters (Drafts + Published)
 * - POST /admin/newsletters     -> Create a new newsletter
 * - PUT /admin/newsletters/:id  -> Edit an existing newsletter
 * - DELETE /admin/newsletters/:id -> Delete a newsletter
 */

const express = require('express');
const router = express.Router();
const { Newsletter } = require('../db/models');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

/* =========================================
   🔓 PUBLIC ROUTES (No Auth Required)
   ========================================= */

/**
 * GET /api/newsletters
 * Fetch all published newsletters for the public homepage
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
    console.error('Error fetching public newsletters:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/newsletters/:slug
 * Fetch a single published newsletter by slug
 */
router.get('/api/newsletters/:slug', async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne({ slug: req.params.slug });

    // console.log(' Fetching newsletter:', {
    //   slug: req.params.slug,
    //   found: !!newsletter,
    //   hasGallery: newsletter ? !!newsletter.gallery : null,
    //   galleryCount: newsletter?.gallery?.length || 0,
    // });

    if (!newsletter) {
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }

    // Security: Do not reveal drafts to public, UNLESS valid Admin Token is present
    if (newsletter.status !== 'published') {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      let isAdmin = false;

      if (token) {
        try {
          // Inline verification to avoid requiring middleware for public route
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          if (decoded && decoded.role === 'admin') {
            isAdmin = true;
          }
        } catch (e) {
          // Token invalid/expired - treat as public user
        }
      }

      if (!isAdmin) {
        return res.status(404).json({ success: false, message: 'Newsletter not found (Draft)' });
      }
    }

    console.log('Sending newsletter data:', {
      title: newsletter.title,
      slug: newsletter.slug,
      hasGallery: !!newsletter.gallery,
      galleryCount: newsletter.gallery?.length || 0,
    });

    res.json({ success: true, data: newsletter });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


/* =========================================
   🔒 ADMIN ROUTES (Token + Admin Role Required)
   ========================================= */

/**
 * GET /admin/newsletters/all
 * Admin Dashboard: Fetch EVERYTHING (Drafts & Published)
 */
router.get('/admin/newsletters/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, data: newsletters });
  } catch (error) {
    console.error('Admin fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /admin/newsletters
 * Create a new newsletter
 */
router.post('/admin/newsletters', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, contentMarkdown, template, status, coverImage, gallery } = req.body;

    console.log('📝 Creating newsletter with data:', {
      title,
      slug,
      status,
      hasGallery: !!gallery,
      galleryCount: gallery?.length || 0,
      galleryContent: gallery || [],
    });

    // Basic Validation
    if (!title || !slug || !contentMarkdown) {
      return res.status(400).json({ success: false, message: 'Title, Slug, and Content are required.' });
    }

    const newsletter = await Newsletter.create({
      title,
      slug,
      excerpt,
      contentMarkdown,
      template: template || 'default',
      status: status || 'draft',
      coverImage: coverImage || null,
      gallery: gallery || [],
      publishedAt: status === 'published' ? new Date() : null,
    });

    console.log('✅ Newsletter created:', {
      id: newsletter._id,
      title: newsletter.title,
      hasGallery: !!newsletter.gallery,
      galleryCount: newsletter.gallery?.length || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Newsletter created successfully',
      data: newsletter,
    });
  } catch (error) {
    // Handle Duplicate Slug
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A newsletter with this slug already exists.' });
    }
    console.error('Create error:', error);
    res.status(500).json({ success: false, message: 'Error creating newsletter' });
  }
});

/**
 * PUT /admin/newsletters/:id
 * Edit an existing newsletter
 */
router.put('/admin/newsletters/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, contentMarkdown, template, status, coverImage, gallery } = req.body;

    // Check if it exists
    const currentNewsletter = await Newsletter.findById(req.params.id);
    if (!currentNewsletter) {
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }

    const updateData = {
      title,
      slug,
      excerpt,
      contentMarkdown,
      template,
      status,
      coverImage,
      gallery
    };

    // Update publishedAt only if flipping from draft -> published
    if (status === 'published' && !currentNewsletter.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Newsletter updated', data: newsletter });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug already taken.' });
    }
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Error updating newsletter' });
  }
});

/**
 * DELETE /admin/newsletters/:id
 * Delete a newsletter
 */
router.delete('/admin/newsletters/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);

    if (!newsletter) {
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }

    res.json({ success: true, message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting newsletter' });
  }
});

module.exports = router;