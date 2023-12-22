const mongoose = require('mongoose');
const winston = require('winston');
require('dotenv').config();

// Create Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// MongoDB connection string
const connectionString = process.env.MONGODB_CONNECTION_STRING;

// Connect to MongoDB using Mongoose
mongoose.connect(connectionString)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("Could not connect to MongoDB:", err);
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