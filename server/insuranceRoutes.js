const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { insuranceModel } = require('./database');
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

// route to GET all insurance entries
router.get('/insurance', async (req, res) => {
  try {
    // fetch all insurance entries with specific fields
    const insuranceEntries = await insuranceModel.find(
      {},
      {
        insurerName: 1,
        mobileNumber: 1,
        email: 1,
        limit: 1,
      }
    );

    // respond with fetched insurance entries
    res.json(insuranceEntries);
  } catch (error) {
    console.error('Error fetching insurance entries using GET all:', error);
    res.status(500).json({ error: 'Internal Server Error for GET all' });
  }
});

// route to GET specific insurance entry by ID
router.get('/insurance/:id', async (req, res) => {
  try {
    // fetch specific insurance entry by ID
    const insuranceEntry = await insuranceModel.findById(req.params.id);

    // check insurance entry exists
    if (!insuranceEntry) {
      return res.status(404).json({ error: 'Insurance entry not found using GET by ID' });
    }

    res.json(insuranceEntry);
  } catch (error) {
    console.error('Error fetching insurance entry using GET by ID:', error);
    res.status(500).json({ error: 'Internal Server Error for GET by ID' });
  }
});

// route to POST create new insurance entry
router.post('/insurance', async (req, res) => {
  try {
    // validate and create new insurance entry
    const insuranceData = req.body;
    if (
      !insuranceData.insurerName ||
      !insuranceData.mobileNumber ||
      !insuranceData.email ||
      !insuranceData.limit
    ) {
      throw new Error('Invalid request body. Missing required fields using POST for new insurance entry.');
    }
    const newInsuranceEntry = await insuranceModel.create(insuranceData);
    res.json(newInsuranceEntry);
  } catch (error) {
    console.error('Error creating insurance entry using POST new insurance entry:', error);
    res.status(500).json({ error: 'Internal Server Error for POST new insurance entry' });
  }
});

// route to PUT update insurance entry by ID
router.put('/insurance/:id', async (req, res) => {
  try {
    const insuranceEntryId = req.params.id;
    // validate, update, and fetch updated insurance entry
    if (!mongoose.Types.ObjectId.isValid(insuranceEntryId)) {
      return res.status(400).json({ error: 'Invalid insurance entry ID using PUT update insurance entry' });
    }

    const updatedInsuranceEntry = await insuranceModel.findByIdAndUpdate(
      insuranceEntryId,
      req.body,
      { new: true }
    );
    // check insurance entry exists
    if (!updatedInsuranceEntry) {
      return res.status(404).json({ error: 'Insurance entry not found using PUT update insurance entry' });
    }

    // respond with updated insurance entry
    res.json(updatedInsuranceEntry);
  } catch (error) {
    console.error('Error updating insurance entry using PUT update insurance entry:', error);
    res.status(500).json({ error: 'Internal Server Error for PUT update insurance entry' });
  }
});

// route to DELETE insurance entry
router.delete('/insurance/:id', async (req, res) => {
  try {
    // delete insurance entry by ID
    const deletedInsuranceEntry = await insuranceModel.findByIdAndDelete(req.params.id);

    // check insurance entry exists
    if (!deletedInsuranceEntry) {
      return res.status(404).json({ error: 'Insurance entry not found using DELETE insurance entry' });
    }

    res.json({ message: 'Insurance entry deleted successfully using DELETE insurance entry' });
  } catch (error) {
    console.error('Error deleting insurance entry using DELETE insurance entry:', error);
    res.status(500).json({ error: 'Internal Server Error with DELETE insurance entry' });
  }
});

// export the router
module.exports = router;