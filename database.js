//import modules
const mongoose = require('mongoose');
const winston = require('winston');

//create Winston logger instance
const logger = winston.createLogger({
  //set logging level to 'info'
  level: 'info',
  //use simple format with a timestamp
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  //configure transports (where logs should go)
  transports: [
    //log errors to console
    new winston.transports.Console(),
    //log errors to 'error.log' flie
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

//MongoDB connection string
const connectionString = 'mongodb://healthway-hospitals-mongo-db:M2Wa1iLUAet2zSO4cwngAkm3ggLWahsnryPTckHwDayLNB33BmUeiPHT9jQjEloWVJ9IsXDCXGEWACDbnze9ig==@healthway-hospitals-mongo-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@healthway-hospitals-mongo-db@';

//connect to MongoDB using Mongoose
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//get default Mongoose connection
const db = mongoose.connection;

//event listener for connection errors
db.on('error', (err) => {
  //log error message if there is an issue with connection
  logger.error(`MongoDB connection error: ${err.message}`);
});

db.once('open', () => {
  //log info message if conection is successful
  logger.info('Connected to MongoDB');
});