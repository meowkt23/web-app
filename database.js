const mongoose = require('mongoose');
const winston = require('winston');
require('dotenv').config();

// Environment Configuration
const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';

// Check if the MongoDB connection string is defined
const connectionString = process.env.MONGODB_CONNECTION_STRING || 'default_connection_string';
console.log(`MongoDB connection string is defined: ${connectionString}`);

// Create Winston logger instance
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

// Get the default Mongoose connection
const db = mongoose.connection;

// Event listener for connection errors
db.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] MongoDB connection error: ${err.message}`);
  logger.error(`MongoDB connection error: ${err.message}`);
});

// Event listener for successful connection
db.once('open', () => {
  console.log(`[${new Date().toISOString()}] Connected to MongoDB successfully`);
  logger.info('Connected to MongoDB successfully');
});

// Connect to MongoDB using Mongoose and return a promise
const connectToMongoDB = async () => {
  try {
    // Set up event listeners before initiating the connection
    // This ensures that we capture events even if they occur before the listeners are attached
    console.log(`[${new Date().toISOString()}] Attempting to connect to MongoDB...`);

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[${new Date().toISOString()}] Connected to MongoDB`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Could not connect to MongoDB:`, err);
    logger.error("Could not connect to MongoDB:", err);
    throw err; // Propagate the error to handle it in the server.js file
  }
};

// Export the connectToMongoDB function
module.exports = connectToMongoDB;

// Log when the script is loaded
console.log("database.js is loaded.");