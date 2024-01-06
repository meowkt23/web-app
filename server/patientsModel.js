const mongoose = require('mongoose');

//define patients schema
const patientsSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  mobileNumber: String,
  email: String,
  alerts: [String],
  notes: String
},
  {collection: 'Patients'} //specify that the collection name is Patients
);

//create the patients model from the schema, specifying the collection name is Patients
//this deals with MongoDB's automatic pluralisation of the model name
const patientsModel = mongoose.model('Patients', patientsSchema, 'Patients');

//export schema and model
module.exports = { patientsSchema, patientsModel };