const mongoose = require('mongoose');

// Define the staff schema
const staffSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  mobileNumber: String,
  email: String,
  role: String,
  department: {
    name: String,
    site: String
  }
},
  {collection: 'Staff'}
);

const staffModel = mongoose.model('Staff', staffSchema, 'Staff');

module.exports = { staffSchema, staffModel };
