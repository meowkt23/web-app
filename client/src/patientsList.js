import React, { useState, useEffect } from 'react';

const PatientsList = () => {
  //state for storing list of patients
  const [patients, setPatients] = useState([]);
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

  //fetch patients from server
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3000/Patients');

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.statusText}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  //function to handle editing of patient
  const handleEdit = (patient) => {
    setIsEditing(true);
    setEditData({ ...patient });
  };

  //function to handle deletion of patient
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/Patient/${_id}`, {
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
    const apiUrl = editData._id ? `http://localhost:3000/Patient/${editData._id}` : 'http://localhost:3000/Patient';
  
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
  
      //fetch updated patients
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
          {Array.isArray(patients) &&
            patients.map((Patients) => (
              <tr key={patient._id}>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>{patient.dateOfBirth}</td>
                <td>{patient.mobileNumber}</td>
                <td>{patient.email}</td>
                <td>{patient.role}</td>
                <td>{patient.department.name}</td>
                <td>{patient.department.site}</td>
                <td>
                  <button onClick={() => handleEdit(Patients)}>Edit</button>
                  <button onClick={() => handleDelete(Patients_id)}>Delete</button>
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
          <input type="text" name="notes" value={editData.role} onChange={handleInputChange} />
        </label>
        <label>
          Alerts:
          <input type="text" name="alerts" value={editData.department.name} onChange={handleInputChange} />
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
