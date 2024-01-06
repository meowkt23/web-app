import React, { useState, useEffect } from 'react';
import 'react-chartjs-2';
import 'chart.js';

const InventoryList = () => {
  // state for storing list of Inventory items
  const [inventoryItems, setInventoryItems] = useState([]);
  // state for tracking whether user is editing
  const [isEditing, setIsEditing] = useState(false);
  // state for storing inventory item data being edited
  const [editData, setEditData] = useState({
    itemName: '',
    category: '',
    quantityAvailable: 0,
    unitPrice: 0,
    manufacturer: '',
    supplier: '',
  });

  // fetch Inventory items from server
  const fetchInventoryItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/inventory');

      if (!response.ok) {
        throw new Error(`Failed to fetch Inventory items: ${response.statusText}`);
      }

      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching Inventory items:', error);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // function to handle editing of inventory item
  const handleEdit = (inventoryItem) => {
    setIsEditing(true);
    setEditData({ ...inventoryItem });
  };

  // function to handle deletion of inventory item
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/inventory/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete inventory item: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh inventory item list after deletion
      fetchInventoryItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  // function to save edited or new inventory item
  const saveInventoryItemToServer = async () => {
    const apiUrl = editData._id
      ? `http://localhost:3000/inventory/${editData._id}`
      : 'http://localhost:3000/inventory';

    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save inventory item: ${response.statusText}`);
      }

      // reset edit data after saving
      setEditData(null);

      // fetch updated Inventory items
      fetchInventoryItems();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  return (
    <div>
      <h2>Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity Available</th>
            <th>Unit Price</th>
            <th>Manufacturer</th>
            <th>Supplier</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(inventoryItems) &&
            inventoryItems.map((inventoryItem) => (
              <tr key={inventoryItem._id}>
                <td>{inventoryItem.itemName}</td>
                <td>{inventoryItem.category}</td>
                <td>{inventoryItem.quantityAvailable}</td>
                <td>{inventoryItem.unitPrice}</td>
                <td>{inventoryItem.manufacturer}</td>
                <td>{inventoryItem.supplier}</td>
                <td>
                  <button onClick={() => handleEdit(inventoryItem)}>Edit</button>
                  <button onClick={() => handleDelete(inventoryItem._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isEditing ? (
        <EditForm
          editData={editData}
          setEditData={setEditData}
          setIsEditing={setIsEditing}
          saveInventoryItemToServer={saveInventoryItemToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Inventory Item</button>
      )}
    </div>
  );
};

// edit form component for editing or adding new inventory item
const EditForm = ({ editData, setEditData, setIsEditing, saveInventoryItemToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
      <form>
        <label>
          Item Name:
          <input type="text" name="itemName" value={editData.itemName} onChange={handleInputChange} />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={editData.category} onChange={handleInputChange} />
        </label>
        <label>
          Quantity Available:
          <input type="number" name="quantityAvailable" value={editData.quantityAvailable} onChange={handleInputChange} />
        </label>
        <label>
          Unit Price:
          <input type="number" name="unitPrice" value={editData.unitPrice} onChange={handleInputChange} />
        </label>
        <label>
          Manufacturer:
          <input type="text" name="manufacturer" value={editData.manufacturer} onChange={handleInputChange} />
        </label>
        <label>
          Supplier:
          <input type="text" name="supplier" value={editData.supplier} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={saveInventoryItemToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default InventoryList;