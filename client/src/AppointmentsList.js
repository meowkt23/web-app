import React, { useState, useEffect } from 'react';

const AppointmentsList = () => {
  // state for storing list of Appointments
  const [appointments, setAppointments] = useState([]);
  // state for tracking whether user is editing
  const [isEditing, setIsEditing] = useState(false);
  // state for storing appointment data being edited
  const [editData, setEditData] = useState({
    date: '',
    time: '',
    patientId: '',
    staffId: '',
    type: '',
  });

  // fetch Appointments from the server
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/appointments');

      if (!response.ok) {
        throw new Error(`Failed to fetch Appointments: ${response.statusText}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching Appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // function to handle editing of appointment
  const handleEdit = (appointment) => {
    setIsEditing(true);
    setEditData({ ...appointment });
  };

  // function to handle deletion of appointment
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/appointments/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete appointment: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh appointment list after deletion
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  // function to save edited or new appointment
  const saveAppointmentToServer = async () => {
    const apiUrl = editData._id
      ? `http://localhost:3000/appointments/${editData._id}`
      : 'http://localhost:3000/appointments';

    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save appointment: ${response.statusText}`);
      }

      // reset edit data after saving
      setEditData(null);

      // fetch updated Appointments
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient ID</th>
            <th>Staff ID</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(appointments) &&
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.patientId}</td>
                <td>{appointment.staffId}</td>
                <td>{appointment.type}</td>
                <td>
                  <button onClick={() => handleEdit(appointment)}>Edit</button>
                  <button onClick={() => handleDelete(appointment._id)}>Delete</button>
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
          saveAppointmentToServer={saveAppointmentToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Appointment</button>
      )}
    </div>
  );
};

// edit form component for editing or adding new appointment
const EditForm = ({ editData, setEditData, setIsEditing, saveAppointmentToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Appointment' : 'Add New Appointment'}</h3>
      <form>
        <label>
          Date:
          <input type="text" name="date" value={editData.date} onChange={handleInputChange} />
        </label>
        <label>
          Time:
          <input type="text" name="time" value={editData.time} onChange={handleInputChange} />
        </label>
        <label>
          Patient ID:
          <input type="text" name="patientId" value={editData.patientId} onChange={handleInputChange} />
        </label>
        <label>
          Staff ID:
          <input type="text" name="staffId" value={editData.staffId} onChange={handleInputChange} />
        </label>
        <label>
          Type:
          <input type="text" name="type" value={editData.type} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={saveAppointmentToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AppointmentsList;