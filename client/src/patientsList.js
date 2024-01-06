import React, { useState, useEffect } from 'react';
import 'react-chartjs-2';
import 'chart.js';

const PatientsList = () => {
  //state for storing list of Patients
  const [Patients, setPatients] = useState([]);
  //state for tracking whether user is editing
  const [isEditing, setIsEditing] = useState(false);
  //state for storing patient data being edited
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    alerts: '',
    notes: ''
  });

  //fetch Patients from server
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3000/Patients');

      if (!response.ok) {
        throw new Error(`Failed to fetch Patients: ${response.statusText}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching Patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  //function to handle editing of patient
  const handleEdit = (Patients) => {
    setIsEditing(true);
    setEditData({ ...Patients });
  };

  //function to handle deletion of patient
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/Patients/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete patient: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh patient list after deletion
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  //function to save edited or new patient
  const savePatientToServer = async () => {
    const apiUrl = editData._id ? `http://localhost:3000/Patients/${editData._id}` : 'http://localhost:3000/Patients';
  
    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save patient: ${response.statusText}`);
      }
  
      //reset edit data after saving
      setEditData(null);
  
      //fetch updated Patients
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  return (
    <div>
      <h2>Patients</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Alerts</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(Patients) &&
            Patients.map((Patients) => (
              <tr key={Patients._id}>
                <td>{Patients.firstName}</td>
                <td>{Patients.lastName}</td>
                <td>{Patients.dateOfBirth}</td>
                <td>{Patients.mobileNumber}</td>
                <td>{Patients.email}</td>
                <td>{Patients.alerts.join(', ')}</td>
                <td>{Patients.notes}</td>
                <td>
                  <button onClick={() => handleEdit(Patients)}>Edit</button>
                  <button onClick={() => handleDelete(Patients._id)}>Delete</button>
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
          savePatientToServer={savePatientToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Patient</button>
      )}
    </div>
  );
};

//edit form component for editing or adding new patient
const EditForm = ({ editData, setEditData, setIsEditing, savePatientToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Patient' : 'Add New Patient'}</h3>
      <form>
        <label>
          First Name:
          <input type="text" name="firstName" value={editData.firstName} onChange={handleInputChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={editData.lastName} onChange={handleInputChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={editData.dateOfBirth} onChange={handleInputChange} />
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
          Notes:
          <input type="text" name="notes" value={editData.notes} onChange={handleInputChange} />
        </label>
        <label>
          Alerts:
          <input type="text" name="alerts" value={editData.alerts} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={savePatientToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};


export default PatientsList;
