const mongoose = require('mongoose');

// define appointments schema
const appointmentsSchema = new mongoose.Schema({
  date: String,
  time: String,
  patientId: String,
  staffId: String,
  type: String,
},
  { collection: 'Appointments' } // specify that the collection name is Appointments
);

// create the appointments model from the schema, specifying the collection name is Appointments
const appointmentsModel = mongoose.model('Appointments', appointmentsSchema, 'Appointments');

// export schema and model
module.exports = { appointmentsSchema, appointmentsModel };