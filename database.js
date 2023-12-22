// Import modules
const mongoose = require('mongoose');
const winston = require('winston');

// Create Winston logger instance
const logger = winston.createLogger({
  // Set logging level to 'info'
  level: 'info',
  // Use a simple format with a timestamp
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  // Configure transports (where logs should go)
  transports: [
    // Log errors to console
    new winston.transports.Console(),
    // Log errors to 'error.log' file
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// MongoDB connection string
const connectionString = 'mongodb://healthway-hospitals-mongo-db:M2Wa1iLUAet2zSO4cwngAkm3ggLWahsnryPTckHwDayLNB33BmUeiPHT9jQjEloWVJ9IsXDCXGEWACDbnze9ig==@healthway-hospitals-mongo-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@healthway-hospitals-mongo-db@';

// Connect to MongoDB using Mongoose
mongoose.connect(connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB: ", err)); // Fix the parameter name here

// Get the default Mongoose connection
const db = mongoose.connection;

// Event listener for connection errors
db.on('error', (err) => {
  // Log error message if there is an issue with the connection
  logger.error(`MongoDB connection error: ${err.message}`);
});

db.once('open', () => {
  // Log info message if connection is successful
  logger.info('Connected to MongoDB');
});