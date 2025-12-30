require('dotenv').config();
const connectDB = require('./db/connection');
const seedAdmin = require('./db/seeds/seedData');
const seedNewsletters = require('./db/seeds/seedNewsletters');

const run = async () => {
  await connectDB();
  await seedAdmin(); // Creates the admin
  await seedNewsletters(); // Creates sample newsletters
  process.exit();
};

run();