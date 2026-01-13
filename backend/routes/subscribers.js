const express = require('express');
const router = express.Router();
const Subscriber = require('../db/models/Subscriber');

// POST /api/subscribers - Add a new subscriber
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email presence
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: 'You are already subscribed to our newsletter!',
                alreadySubscribed: true
            });
        }

        // Create new subscriber
        const subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the newsletter!',
            data: {
                email: subscriber.email,
                subscribedAt: subscriber.subscribedAt
            }
        });

    } catch (error) {
        console.error('Subscription error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Handle duplicate key error (in case unique index catches it)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You are already subscribed to our newsletter!',
                alreadySubscribed: true
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again later.'
        });
    }
});

// GET /api/subscribers/count - Get total subscriber count
router.get('/count', async (req, res) => {
    try {
        const count = await Subscriber.countDocuments({ isActive: true });

        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Error fetching subscriber count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscriber count'
        });
    }
});

// GET /api/subscribers - Get all subscribers (admin only - can be protected later)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ isActive: true })
            .select('email subscribedAt')
            .sort({ subscribedAt: -1 });

        res.json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers'
        });
    }
});

// DELETE /api/subscribers/:id - Delete a subscriber
router.delete('/:id', async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.json({
            success: true,
            message: 'Subscriber removed successfully'
        });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete subscriber'
        });
    }
});

module.exports = router;
