const express = require('express');
const router = express.Router();
const Newsletter = require('../db/models/Newsletter');
const verifyToken = require('../middleware/auth');

// Get all published newsletters
router.get('/', async (req, res) => {
  try {
    console.log('📰 Fetching published newsletters...');
    const newsletters = await Newsletter.find({ status: 'published' })
      .sort({ publishedAt: -1 });
    
    console.log(`✅ Found ${newsletters.length} published newsletters`);
    res.json({ success: true, data: newsletters });
  } catch (error) {
    console.error('❌ Error fetching newsletters:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single newsletter by slug
router.get('/:slug', async (req, res) => {
  try {
    console.log(`📄 Fetching newsletter with slug: ${req.params.slug}`);
    const newsletter = await Newsletter.findOne({ slug: req.params.slug });
    
    if (!newsletter) {
      console.log(`❌ Newsletter not found: ${req.params.slug}`);
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }
    
    console.log(`✅ Found newsletter: ${newsletter.title}`);
    res.json({ success: true, data: newsletter });
  } catch (error) {
    console.error('❌ Error fetching newsletter:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all newsletters (admin only) - MUST BE BEFORE POST
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    console.log('👨‍💼 Admin fetching all newsletters...');
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${newsletters.length} total newsletters`);
    res.json({ success: true, data: newsletters });
  } catch (error) {
    console.error('❌ Error fetching admin newsletters:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create newsletter (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, slug, excerpt, contentHtml, template, status, coverImage } = req.body;

    console.log(`📝 Creating newsletter: ${title}`);

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(400).json({ success: false, message: 'Slug is required' });
    }
    if (!contentHtml || !contentHtml.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Slug must be lowercase with numbers and hyphens only' 
      });
    }

    const newsletter = new Newsletter({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      excerpt: excerpt?.trim() || '',
      contentMarkdown: contentHtml,
      template: template || 'default',
      status: status || 'draft',
      coverImage: coverImage || null,
    });

    await newsletter.save();
    console.log(`✅ Newsletter created: ${title}`);
    res.status(201).json({ success: true, data: newsletter });
  } catch (error) {
    console.error('❌ Error creating newsletter:', error);
    
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({ 
        success: false, 
        message: 'A newsletter with this slug already exists' 
      });
    }
    
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update newsletter (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, slug, excerpt, contentHtml, template, status, coverImage } = req.body;

    console.log(`✏️  Updating newsletter: ${req.params.id}`);

    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        excerpt,
        contentMarkdown: contentHtml,
        template,
        status,
        coverImage: coverImage || null,
      },
      { new: true, runValidators: true }
    );

    if (!newsletter) {
      console.log(`❌ Newsletter not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }

    console.log(`✅ Newsletter updated: ${title}`);
    res.json({ success: true, data: newsletter });
  } catch (error) {
    console.error('❌ Error updating newsletter:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete newsletter (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    console.log(`🗑️  Deleting newsletter: ${req.params.id}`);
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!newsletter) {
      console.log(`❌ Newsletter not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Newsletter not found' });
    }
    
    console.log(`✅ Newsletter deleted: ${newsletter.title}`);
    res.json({ success: true, message: 'Newsletter deleted' });
  } catch (error) {
    console.error('❌ Error deleting newsletter:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
