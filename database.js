const mongoose = require('mongoose');
const winston = require('winston');

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

const connectionString = 'mongodb://healthway-hospitals-mongo-db:M2Wa1iLUAet2zSO4cwngAkm3ggLWahsnryPTckHwDayLNB33BmUeiPHT9jQjEloWVJ9IsXDCXGEWACDbnze9ig==@healthway-hospitals-mongo-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@healthway-hospitals-mongo-db@';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

db.once('open', () => {
  logger.info('Connected to MongoDB');
});