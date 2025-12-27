require('dotenv').config();
const connectDB = require('./db/connection');
const seedAdmin = require('./db/seeds/seedData');

const run = async () => {
  await connectDB();
  await seedAdmin(); // Creates the admin
  process.exit();
};

run();