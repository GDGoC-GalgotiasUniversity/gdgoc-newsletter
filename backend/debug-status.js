require('dotenv').config();
const mongoose = require('mongoose');
const Newsletter = require('./db/models/Newsletter');

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const newsletters = await Newsletter.find({});

        console.log(`\n--- DATABASE REPORT ---`);
        console.log(`Total Newsletters: ${newsletters.length}`);

        const counts = { draft: 0, published: 0, other: 0 };

        newsletters.forEach(n => {
            if (n.status === 'draft') counts.draft++;
            else if (n.status === 'published') counts.published++;
            else counts.other++;
        });

        console.log(`Published: ${counts.published}`);
        console.log(`Drafts: ${counts.draft}`);
        console.log(`Other: ${counts.other}`);

        console.log(`\n--- DETAILS ---`);
        newsletters.forEach(n => {
            console.log(`- "${n.title}" [${n.status}] (Slug: ${n.slug})`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkStatus();
