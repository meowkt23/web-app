const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { billingModel } = require('./database');
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

// route to GET all billing entries
router.get('/billing', async (req, res) => {
  try {
    // fetch all billing entries with specific fields
    const billingEntries = await billingModel.find(
      {},
      {
        date: 1,
        time: 1,
        patientId: 1,
        staffId: 1,
        amount: 1,
        paymentStatus: 1,
        insurerClaimed: 1,
        insurerId: 1,
        billingDetails: 1,
      }
    );

    // respond with fetched billing entries
    res.json(billingEntries);
  } catch (error) {
    console.error('Error fetching billing entries using GET all:', error);
    res.status(500).json({ error: 'Internal Server Error for GET all' });
  }
});

// route to GET specific billing entry by ID
router.get('/billing/:id', async (req, res) => {
  try {
    // fetch specific billing entry by ID
    const billingEntry = await billingModel.findById(req.params.id);

    // check billing entry exists
    if (!billingEntry) {
      return res.status(404).json({ error: 'Billing entry not found using GET by ID' });
    }

    res.json(billingEntry);
  } catch (error) {
    console.error('Error fetching billing entry using GET by ID:', error);
    res.status(500).json({ error: 'Internal Server Error for GET by ID' });
  }
});

// route to POST create new billing entry
router.post('/billing', async (req, res) => {
  try {
    // validate and create new billing entry
    const billingData = req.body;
    if (
      !billingData.date ||
      !billingData.time ||
      !billingData.patientId ||
      !billingData.staffId ||
      !billingData.amount ||
      !billingData.paymentStatus ||
      !billingData.insurerClaimed ||
      !billingData.insurerId ||
      !billingData.billingDetails
    ) {
      throw new Error('Invalid request body. Missing required fields using POST for new billing entry.');
    }
    const newBillingEntry = await billingModel.create(billingData);
    res.json(newBillingEntry);
  } catch (error) {
    console.error('Error creating billing entry using POST new billing entry:', error);
    res.status(500).json({ error: 'Internal Server Error for POST new billing entry' });
  }
});

// route to PUT update billing entry by ID
router.put('/billing/:id', async (req, res) => {
  try {
    const billingEntryId = req.params.id;
    // validate, update, and fetch updated billing entry
    if (!mongoose.Types.ObjectId.isValid(billingEntryId)) {
      return res.status(400).json({ error: 'Invalid billing entry ID using PUT update billing entry' });
    }

    const updatedBillingEntry = await billingModel.findByIdAndUpdate(
      billingEntryId,
      req.body,
      { new: true }
    );
    // check billing entry exists
    if (!updatedBillingEntry) {
      return res.status(404).json({ error: 'Billing entry not found using PUT update billing entry' });
    }

    // respond with updated billing entry
    res.json(updatedBillingEntry);
  } catch (error) {
    console.error('Error updating billing entry using PUT update billing entry:', error);
    res.status(500).json({ error: 'Internal Server Error for PUT update billing entry' });
  }
});

// route to DELETE billing entry
router.delete('/billing/:id', async (req, res) => {
  try {
    // delete billing entry by ID
    const deletedBillingEntry = await billingModel.findByIdAndDelete(req.params.id);

    // check billing entry exists
    if (!deletedBillingEntry) {
      return res.status(404).json({ error: 'Billing entry not found using DELETE billing entry' });
    }

    res.json({ message: 'Billing entry deleted successfully using DELETE billing entry' });
  } catch (error) {
    console.error('Error deleting billing entry using DELETE billing entry:', error);
    res.status(500).json({ error: 'Internal Server Error with DELETE billing entry' });
  }
});

// export the router
module.exports = router;