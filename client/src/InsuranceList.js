import React, { useState, useEffect } from 'react';

const InsuranceList = () => {
  // state for storing list of Insurance entries
  const [insuranceEntries, setInsuranceEntries] = useState([]);
  // state for tracking whether the user is editing
  const [isEditing, setIsEditing] = useState(false);
  // state for storing insurance entry data being edited
  const [editData, setEditData] = useState({
    insurerName: '',
    mobileNumber: '',
    email: '',
    limit: 0,
  });

  // fetch Insurance entries from the server
  const fetchInsuranceEntries = async () => {
    try {
      const response = await fetch('http://localhost:3000/insurance');

      if (!response.ok) {
        throw new Error(`Failed to fetch Insurance entries: ${response.statusText}`);
      }

      const data = await response.json();
      setInsuranceEntries(data);
    } catch (error) {
      console.error('Error fetching Insurance entries:', error);
    }
  };

  useEffect(() => {
    fetchInsuranceEntries();
  }, []);

  // function to handle editing of insurance entry
  const handleEdit = (insuranceEntry) => {
    setIsEditing(true);
    setEditData({ ...insuranceEntry });
  };

  // function to handle deletion of insurance entry
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/insurance/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete insurance entry: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh insurance entry list after deletion
      fetchInsuranceEntries();
    } catch (error) {
      console.error('Error deleting insurance entry:', error);
    }
  };

  // function to save edited or new insurance entry
  const saveInsuranceEntryToServer = async () => {
    const apiUrl = editData._id
      ? `http://localhost:3000/insurance/${editData._id}`
      : 'http://localhost:3000/insurance';

    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save insurance entry: ${response.statusText}`);
      }

      // reset edit data after saving
      setEditData(null);

      // fetch updated Insurance entries
      fetchInsuranceEntries();
    } catch (error) {
      console.error('Error saving insurance entry:', error);
    }
  };

  return (
    <div>
      <h2>Insurance</h2>
      <table>
        <thead>
          <tr>
            <th>Insurer Name</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Limit</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(insuranceEntries) &&
            insuranceEntries.map((insuranceEntry) => (
              <tr key={insuranceEntry._id}>
                <td>{insuranceEntry.insurerName}</td>
                <td>{insuranceEntry.mobileNumber}</td>
                <td>{insuranceEntry.email}</td>
                <td>{insuranceEntry.limit}</td>
                <td>
                  <button onClick={() => handleEdit(insuranceEntry)}>Edit</button>
                  <button onClick={() => handleDelete(insuranceEntry._id)}>Delete</button>
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
          saveInsuranceEntryToServer={saveInsuranceEntryToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Insurance Entry</button>
      )}
    </div>
  );
};

// edit form component for editing or adding new insurance entry
const EditForm = ({ editData, setEditData, setIsEditing, saveInsuranceEntryToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Insurance Entry' : 'Add New Insurance Entry'}</h3>
      <form>
        <label>
          Insurer Name:
          <input type="text" name="insurerName" value={editData.insurerName} onChange={handleInputChange} />
        </label>
        <label>
          Mobile Number:
          <input type="text" name="mobileNumber" value={editData.mobileNumber} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={editData.email} onChange={handleInputChange} />
        </label>
        <label>
          Limit:
          <input type="number" name="limit" value={editData.limit} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={saveInsuranceEntryToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default InsuranceList;