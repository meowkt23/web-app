const mongoose = require('mongoose');

// define inventory schema
const inventorySchema = new mongoose.Schema({
  itemName: String,
  category: String,
  quantityAvailable: Number,
  unitPrice: Number,
  manufacturer: String,
  supplier: String,
},
  { collection: 'Inventory' } // specify that the collection name is Inventory
);

// create the inventory model from the schema, specifying the collection name is Inventory
const inventoryModel = mongoose.model('Inventory', inventorySchema, 'Inventory');

// export schema and model
module.exports = { inventorySchema, inventoryModel };