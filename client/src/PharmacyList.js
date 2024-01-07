import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'chart.js/auto';

const PharmacyList = () => {
  const [medications, setMedications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    medicationName: '',
    manufacturer: '',
    currentStock: '',
    unitPrice: '',
    expirationDate: '',
  });

  const [barChart, setBarChart] = useState(null);

  const fetchMedications = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/Pharmacy');

      if (!response.ok) {
        throw new Error(`Failed to fetch Medications: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return;
      }

      console.log('Medication Data:', data);
      setMedications(data);
    } catch (error) {
      console.error('Error fetching Medications:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMedications();
    };

    fetchData();
  }, [fetchMedications]);

  useEffect(() => {
    if (medications.length > 0) {
      const ctx = document.getElementById('barChart');
      console.log('Canvas Context:', ctx);

      if (barChart instanceof Chart) {
        // Update the existing chart's data and options
        barChart.data.labels = medications.map((medication) => medication.medicationName);
        barChart.data.datasets[0].data = medications.map((medication) => medication.currentStock);

        // Update chart options if needed
        // barChart.options = ...

        // Update the chart
        barChart.update();
      } else {
        // Create a new chart if it doesn't exist
        const labels = medications.map((medication) => medication.medicationName);
        const stockData = medications.map((medication) => medication.currentStock);

        const newBarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Current Stock',
                data: stockData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'category',
                labels: labels,
              },
            },
          },
        });

        setBarChart(newBarChart);
      }
    }
  }, [medications, barChart]);

  const handleEdit = (medication) => {
    setIsEditing(true);
    setEditData({ ...medication });
  };

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

      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

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

      setEditData({
        medicationName: '',
        manufacturer: '',
        currentStock: '',
        unitPrice: '',
        expirationDate: '',
      });

      fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  return (
    <div>
      <h2>Pharmacy</h2>
      <div>
        <h3>Medication Stock Levels</h3>
        <canvas id="barChart" width="400" height="200"></canvas>
      </div>
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
