const mongoose = require('mongoose');

// define appointment schema
const appointmentSchema = new mongoose.Schema({
  date: String,
  time: String,
  patientId: String,
  staffId: String,
  type: String,
},
  { collection: 'Appointments' } // specify that the collection name is Appointments
);

// create the appointment model from the schema, specifying the collection name is Appointments
const appointmentModel = mongoose.model('Appointments', appointmentSchema, 'Appointments');

// export schema and model
module.exports = { appointmentSchema, appointmentModel };