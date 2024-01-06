const mongoose = require('mongoose');

// define pharmacy schema
const pharmacySchema = new mongoose.Schema({
  medicationName: String,
  manufacturer: String,
  currentStock: Number,
  unitPrice: Number,
  expirationDate: Date,
},
  { collection: 'Pharmacy' } // specify that the collection name is Pharmacy
);

// create the pharmacy model from the schema, specifying the collection name is Pharmacy
const pharmacyModel = mongoose.model('Pharmacy', pharmacySchema, 'Pharmacy');

// export schema and model
module.exports = { pharmacySchema, pharmacyModel };