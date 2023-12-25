// staff-model.js
const mongoose = require('mongoose');

// Define the staff schema
const staffSchema = new mongoose.Schema({
  staffId: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  mobileNumber: String,
  email: String,
  role: String,
  department: {
    name: String,
    site: String,
  },
});

const StaffModel = mongoose.model('Staff', staffSchema);

module.exports = { StaffModel, staffSchema };
