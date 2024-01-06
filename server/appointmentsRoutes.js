const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { appointmentsModel } = require('./database');
const router = express.Router();

// set up CORS config for the router
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// apply CORS middleware to router
router.use(cors(corsOptions));

// route to GET all appointments
router.get('/appointments', async (req, res) => {
  try {
    // fetch all appointments with specific fields
    const appointments = await appointmentsModel.find(
      {},
      {
        date: 1,
        time: 1,
        patientId: 1,
        staffId: 1,
        type: 1,
      }
    );

    // respond with fetched appointments
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments using GET all:', error);
    res.status(500).json({ error: 'Internal Server Error for GET all' });
  }
});

// route to GET specific appointments by ID
router.get('/appointments/:id', async (req, res) => {
  try {
    // fetch specific appointments by ID
    const appointments = await appointmentsModel.findById(req.params.id);

    // check appointments exists
    if (!appointments) {
      return res.status(404).json({ error: 'Appointment not found using GET by ID' });
    }

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments using GET by ID:', error);
    res.status(500).json({ error: 'Internal Server Error for GET by ID' });
  }
});

// route to POST create new appointments
router.post('/appointments', async (req, res) => {
  try {
    // validate and create new appointments
    const appointmentsData = req.body;
    if (
      !appointmentsData.date ||
      !appointmentsData.time ||
      !appointmentsData.patientId ||
      !appointmentsData.staffId ||
      !appointmentsData.type
    ) {
      throw new Error('Invalid request body. Missing required fields using POST for new appointment.');
    }
    const newAppointment = await appointmentsModel.create(appointmenstData);
    res.json(newAppointment);
  } catch (error) {
    console.error('Error creating appointments using POST new appointment:', error);
    res.status(500).json({ error: 'Internal Server Error for POST new appointment' });
  }
});

// route to PUT update appointment by ID
router.put('/appointments/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    // validate, update, and fetch updated appointment
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: 'Invalid appointment ID using PUT update appointment' });
    }

    const updatedAppointment = await appointmentsModel.findByIdAndUpdate(
      appointmentId,
      req.body,
      { new: true }
    );
    // check appointment exists
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found using PUT update appointment' });
    }

    // respond with updated appointment
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment using PUT update appointment:', error);
    res.status(500).json({ error: 'Internal Server Error for PUT update appointment' });
  }
});

// route to DELETE appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    // delete appointment by ID
    const deletedAppointment = await appointmentsModel.findByIdAndDelete(req.params.id);

    // check appointment exists
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found using DELETE appointment' });
    }

    res.json({ message: 'Appointment deleted successfully using DELETE appointment' });
  } catch (error) {
    console.error('Error deleting appointment using DELETE appointment:', error);
    res.status(500).json({ error: 'Internal Server Error with DELETE appointment' });
  }
});

// export the router
module.exports = router;