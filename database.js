const mongoose = require('mongoose');
const winston = require('winston');
require('dotenv').config();

// Check if the MongoDB connection string is defined
const connectionString = process.env.MONGODB_CONNECTION_STRING || 'default_connection_string';
console.log('MongoDB Connection String:', connectionString);

// Create Winston logger instance
const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = isDevelopment ? 'debug' : 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Attempt to connect to MongoDB using Mongoose
console.log('Attempting to connect to MongoDB...');
mongoose.connect(connectionString)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("Could not connect to MongoDB:", err);
    // Optionally: exit the application or take other action
  });

// Get the default Mongoose connection
const db = mongoose.connection;

// Event listener for connection errors
db.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

db.once('open', () => {
  logger.info('Connected to MongoDB successfully');
});

module.exports = db;