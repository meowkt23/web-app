const mongoose = require('mongoose');

//define staff schema
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
  {collection: 'Staff'} //specify that the collection name is Staff
);

//create the staff model from the schema, specifying the collection name is Staff
//this deals with MongoDB's automatic pluralisation of the model name
const staffModel = mongoose.model('Staff', staffSchema, 'Staff');

//export schema and model
module.exports = { staffSchema, staffModel };