// Import  Mongoose library
const mongoose = require('mongoose');

// Define a Mongoose schema for the 'staff' model
const staffSchema = new mongoose.Schema({
    // Define the 'staffId' field as a string
    staffId: String,
    // Define the 'firstName' field as a string
    firstName: String,
    // Define the 'lastName' field as a string
    lastName: String
});

// Create and export the 'staff' model using the defined schema
module.exports = mongoose.model('staff', staffSchema);
