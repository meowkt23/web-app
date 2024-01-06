const mongoose = require('mongoose');

// define billing schema
const billingSchema = new mongoose.Schema({
  date: String,
  time: String,
  patientId: String,
  staffId: String,
  amount: Number,
  paymentStatus: String,
  insurerClaimed: Boolean,
  insurerId: String,
  billingDetails: [
    {
      service: String,
      charge: Number,
    },
  ],
},
  { collection: 'Billing' } // specify that the collection name is Billing
);

// create the billing model from the schema, specifying the collection name is Billing
const billingModel = mongoose.model('Billing', billingSchema, 'Billing');

// export schema and model
module.exports = { billingSchema, billingModel };