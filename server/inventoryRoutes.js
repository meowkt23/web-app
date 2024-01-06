const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { inventoryModel } = require('./database');
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

// route to GET all inventory items
router.get('/inventory', async (req, res) => {
  try {
    // fetch all inventory items with specific fields
    const inventoryItems = await inventoryModel.find(
      {},
      {
        itemName: 1,
        category: 1,
        quantityAvailable: 1,
        unitPrice: 1,
        manufacturer: 1,
        supplier: 1,
      }
    );

    // respond with fetched inventory items
    res.json(inventoryItems);
  } catch (error) {
    console.error('Error fetching inventory items using GET all:', error);
    res.status(500).json({ error: 'Internal Server Error for GET all' });
  }
});

// route to GET specific inventory item by ID
router.get('/inventory/:id', async (req, res) => {
  try {
    // fetch specific inventory item by ID
    const inventoryItem = await inventoryModel.findById(req.params.id);

    // check inventory item exists
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found using GET by ID' });
    }

    res.json(inventoryItem);
  } catch (error) {
    console.error('Error fetching inventory item using GET by ID:', error);
    res.status(500).json({ error: 'Internal Server Error for GET by ID' });
  }
});

// route to POST create new inventory item
router.post('/inventory', async (req, res) => {
  try {
    // validate and create new inventory item
    const inventoryData = req.body;
    if (
      !inventoryData.itemName ||
      !inventoryData.category ||
      !inventoryData.quantityAvailable ||
      !inventoryData.unitPrice ||
      !inventoryData.manufacturer ||
      !inventoryData.supplier
    ) {
      throw new Error('Invalid request body. Missing required fields using POST for new inventory item.');
    }
    const newInventoryItem = await inventoryModel.create(inventoryData);
    res.json(newInventoryItem);
  } catch (error) {
    console.error('Error creating inventory item using POST new inventory item:', error);
    res.status(500).json({ error: 'Internal Server Error for POST new inventory item' });
  }
});

// route to PUT update inventory item by ID
router.put('/inventory/:id', async (req, res) => {
  try {
    const inventoryItemId = req.params.id;
    // validate, update, and fetch updated inventory item
    if (!mongoose.Types.ObjectId.isValid(inventoryItemId)) {
      return res.status(400).json({ error: 'Invalid inventory item ID using PUT update inventory item' });
    }

    const updatedInventoryItem = await inventoryModel.findByIdAndUpdate(
      inventoryItemId,
      req.body,
      { new: true }
    );
    // check inventory item exists
    if (!updatedInventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found using PUT update inventory item' });
    }

    // respond with updated inventory item
    res.json(updatedInventoryItem);
  } catch (error) {
    console.error('Error updating inventory item using PUT update inventory item:', error);
    res.status(500).json({ error: 'Internal Server Error for PUT update inventory item' });
  }
});

// route to DELETE inventory item
router.delete('/inventory/:id', async (req, res) => {
  try {
    // delete inventory item by ID
    const deletedInventoryItem = await inventoryModel.findByIdAndDelete(req.params.id);

    // check inventory item exists
    if (!deletedInventoryItem) {
      return res.status(404).json({ error: 'Inventory item not found using DELETE inventory item' });
    }

    res.json({ message: 'Inventory item deleted successfully using DELETE inventory item' });
  } catch (error) {
    console.error('Error deleting inventory item using DELETE inventory item:', error);
    res.status(500).json({ error: 'Internal Server Error with DELETE inventory item' });
  }
});

// export the router
module.exports = router;