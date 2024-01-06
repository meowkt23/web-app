import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js';

const PharmacyList = () => {
  //state for storing list of Medications
  const [medications, setMedications] = useState([]);
  //state for tracking whether user is editing
  const [isEditing, setIsEditing] = useState(false);
  //state for storing medication data being edited
  const [editData, setEditData] = useState({
    medicationName: '',
    manufacturer: '',
    currentStock: '',
    unitPrice: '',
    expirationDate: '',
  });

  //fetch Medications from server
  const fetchMedications = async () => {
    try {
      const response = await fetch('http://localhost:3000/Pharmacy');

      if (!response.ok) {
        throw new Error(`Failed to fetch Medications: ${response.statusText}`);
      }

      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error('Error fetching Medications:', error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  //function to handle editing of medication
  const handleEdit = (medication) => {
    setIsEditing(true);
    setEditData({ ...medication });
  };

  //function to handle deletion of medication
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/Pharmacy/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete medication: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh medication list after deletion
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  //function to save edited or new medication
  const saveMedicationToServer = async () => {
    const apiUrl = editData._id
      ? `http://localhost:3000/Pharmacy/${editData._id}`
      : 'http://localhost:3000/Pharmacy';

    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save medication: ${response.statusText}`);
      }

      // reset edit data after saving
      setEditData(null);

      // fetch updated Medications
      fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  return (
    <div>
      <h2>Pharmacy</h2>
      <table>
        <thead>
          <tr>
            <th>Medication Name</th>
            <th>Manufacturer</th>
            <th>Current Stock</th>
            <th>Unit Price</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(medications) &&
            medications.map((medication) => (
              <tr key={medication._id}>
                <td>{medication.medicationName}</td>
                <td>{medication.manufacturer}</td>
                <td>{medication.currentStock}</td>
                <td>{medication.unitPrice}</td>
                <td>{medication.expirationDate}</td>
                <td>
                  <button onClick={() => handleEdit(medication)}>Edit</button>
                  <button onClick={() => handleDelete(medication._id)}>Delete</button>
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
          saveMedicationToServer={saveMedicationToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Medication</button>
      )}
    </div>
  );
};

//edit form component for editing or adding new medication
const EditForm = ({ editData, setEditData, setIsEditing, saveMedicationToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Medication' : 'Add New Medication'}</h3>
      <form>
        <label>
          Medication Name:
          <input type="text" name="medicationName" value={editData.medicationName} onChange={handleInputChange} />
        </label>
        <label>
          Manufacturer:
          <input type="text" name="manufacturer" value={editData.manufacturer} onChange={handleInputChange} />
        </label>
        <label>
          Current Stock:
          <input type="number" name="currentStock" value={editData.currentStock} onChange={handleInputChange} />
        </label>
        <label>
          Unit Price:
          <input type="number" name="unitPrice" value={editData.unitPrice} onChange={handleInputChange} />
        </label>
        <label>
          Expiration Date:
          <input type="date" name="expirationDate" value={editData.expirationDate} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={saveMedicationToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PharmacyList;