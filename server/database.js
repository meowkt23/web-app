require('dotenv').config();
const mongoose = require('mongoose');
const winston = require('winston');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';

const connectionString = process.env.MONGODB_CONNECTION_STRING || 'default_connection_string';
console.log(`MongoDB connection string is defined: ${connectionString}`);

const logLevel = isDevelopment ? 'debug' : 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

const connectToMongoDB = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Attempting to connect to MongoDB...`);
    await mongoose.connect(connectionString, {
    });
    console.log(`[${new Date().toISOString()}] Connected to MongoDB`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Could not connect to MongoDB:`, err);
    logger.error("Could not connect to MongoDB:", err);
    throw err;
  }
};

// Log when the script is loaded
console.log("database.js is loaded.");

module.exports = { connectToMongoDB };