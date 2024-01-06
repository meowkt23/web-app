//patientsRoutes.js defines routes for handling patients

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { patientsModel } = require('./database');
const router = express.Router();

//set up CORS config for the router
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

//apply CORS middleware to router
router.use(cors(corsOptions));

//route to GET all patients
router.get('/Patients', async (req, res) => {
  try {
    //fetch all patients with specific fields
    const patients = await patientsModel.find({}, {
      'firstName': 1,
      'lastName': 1,
      'dateOfBirth': 1,
      'mobileNumber': 1,
      'email': 1,
      'alerts': 1,
      'notes': 1,
    });

    //respond with fetched patients
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients using GET all:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for GET all' }); //error log
  }
});

//route to GET specific patient by ID
router.get('/Patients/:id', async (req, res) => {
  try {
    //fetch specific patientsby ID
    const patient = await patientsModel.findById(req.params.id);

    //check patient exists
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found using GET by ID' }); //error log
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient using GET by ID:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for GET by ID' }); //error log
  }
});

//route to POST create new patient
router.post('/Patients', async (req, res) => {
  try {
    //validate and create new patient
    const patientData = req.body;
    if (!patientData.firstName || !patientData.lastName || !patientData.dateOfBirth || !patientData.mobileNumber || !patientData.email || !patientData.alerts || !patientData.notes) {
      throw new Error('Invalid request body. Missing required fields using POST for new patient.'); //error log
    }
    const newPatient = await patientsModel.create(patientData);
    res.json(newPatient);
  } catch (error) {
    console.error('Error creating patient using POST new patient:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for POST new patient' }); //error log
  }
});

//route to PUT update patient by ID
router.put('/Patients/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    //validate, update and fetch updated patient
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID using PUT update patient' }); //error log
    }

    const updatedPatient = await patientsModel.findByIdAndUpdate(patientId, req.body, { new: true });
    //check patient exists
    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found using PUT update patient' }); //error log
    }

    //respond with updated patients
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient using PUT update patient:', error); //error log
    res.status(500).json({ error: 'Internal Server Error for PUT update patient' }); //error log
  }
});

//route to DELETE patient
router.delete('/patient/:id', async (req, res) => {
  try {
    //delete patient by ID
    const deletedPatient = await patientsModel.findByIdAndDelete(req.params.id);

    //check patient exists
    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found using DELETE patient' }); //error log
    }

    res.json({ message: 'Patient deleted successfully using DELETE patient' }); //success log
  } catch (error) {
    console.error('Error deleting patient using DELETE patient:', error); //error log
    res.status(500).json({ error: 'Internal Server Error with DELETE patient' }); //error log
  }
});

//export the router
module.exports = router;