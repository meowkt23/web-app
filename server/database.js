//database.js establishes the MongoDB connection and exports relevant elements

//import mongoose for MongoDB use and dotenv to load .env variables
const mongoose = require('mongoose');
require('dotenv').config();

//fetch MongoDB connection string from .env file
const connectionString = process.env.MONGODB_CONNECTION_STRING;

//import staffSchema from staff-model.js
const { staffSchema } = require('./staff-model');

//define asychnronous function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    console.log(`Connecting to MongoDB...`); //console log
    //use mongoose to connect to MongoDB
    await mongoose.connect(connectionString);
    console.log(`Connected to MongoDB`); //console log
  } catch (err) {
    console.error(`Could not connect to MongoDB:`, err); //error log
    throw err;
  }
};

//export connectToMongoDB function and mongoose instance
module.exports = { connectToMongoDB, mongoose}