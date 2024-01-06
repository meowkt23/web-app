const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { pharmacyModel } = require('./database');
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

// route to GET all medications
router.get('/pharmacy', async (req, res) => {
  try {
    // fetch all medications with specific fields
    const medications = await pharmacyModel.find(
      {},
      {
        medicationName: 1,
        manufacturer: 1,
        currentStock: 1,
        unitPrice: 1,
        expirationDate: 1,
      }
    );

    // respond with fetched medications
    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications using GET all:', error);
    res.status(500).json({ error: 'Internal Server Error for GET all' });
  }
});

// route to GET specific medication by ID
router.get('/pharmacy/:id', async (req, res) => {
  try {
    // fetch specific medication by ID
    const medication = await pharmacyModel.findById(req.params.id);

    // check medication exists
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found using GET by ID' });
    }

    res.json(medication);
  } catch (error) {
    console.error('Error fetching medication using GET by ID:', error);
    res.status(500).json({ error: 'Internal Server Error for GET by ID' });
  }
});

// route to POST create new medication
router.post('/pharmacy', async (req, res) => {
  try {
    // validate and create new medication
    const medicationData = req.body;
    if (
      !medicationData.medicationName ||
      !medicationData.manufacturer ||
      !medicationData.currentStock ||
      !medicationData.unitPrice ||
      !medicationData.expirationDate
    ) {
      throw new Error('Invalid request body. Missing required fields using POST for new medication.');
    }
    const newMedication = await pharmacyModel.create(medicationData);
    res.json(newMedication);
  } catch (error) {
    console.error('Error creating medication using POST new medication:', error);
    res.status(500).json({ error: 'Internal Server Error for POST new medication' });
  }
});

// route to PUT update medication by ID
router.put('/pharmacy/:id', async (req, res) => {
  try {
    const medicationId = req.params.id;
    // validate, update, and fetch updated medication
    if (!mongoose.Types.ObjectId.isValid(medicationId)) {
      return res.status(400).json({ error: 'Invalid medication ID using PUT update medication' });
    }

    const updatedMedication = await pharmacyModel.findByIdAndUpdate(medicationId, req.body, { new: true });
    // check medication exists
    if (!updatedMedication) {
      return res.status(404).json({ error: 'Medication not found using PUT update medication' });
    }

    // respond with updated medication
    res.json(updatedMedication);
  } catch (error) {
    console.error('Error updating medication using PUT update medication:', error);
    res.status(500).json({ error: 'Internal Server Error for PUT update medication' });
  }
});

// route to DELETE medication
router.delete('/pharmacy/:id', async (req, res) => {
  try {
    // delete medication by ID
    const deletedMedication = await pharmacyModel.findByIdAndDelete(req.params.id);

    // check medication exists
    if (!deletedMedication) {
      return res.status(404).json({ error: 'Medication not found using DELETE medication' });
    }

    res.json({ message: 'Medication deleted successfully using DELETE medication' });
  } catch (error) {
    console.error('Error deleting medication using DELETE medication:', error);
    res.status(500).json({ error: 'Internal Server Error with DELETE medication' });
  }
});

// export the router
module.exports = router;