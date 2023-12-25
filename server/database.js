const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGODB_CONNECTION_STRING || 'default_connection_string';

const connectToMongoDB = async () => {
  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(connectionString);
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error(`Could not connect to MongoDB:`, err);
    throw err;
  }
};

module.exports = { connectToMongoDB, mongoose };