const mongoose = require('mongoose');

// define insurance schema
const insuranceSchema = new mongoose.Schema({
  insurerName: String,
  mobileNumber: String,
  email: String,
  limit: Number,
},
  { collection: 'Insurance' } // specify that the collection name is Insurance
);

// create the insurance model from the schema, specifying the collection name is Insurance
const insuranceModel = mongoose.model('Insurance', insuranceSchema, 'Insurance');

// export schema and model
module.exports = { insuranceSchema, insuranceModel };