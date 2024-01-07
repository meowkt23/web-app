import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    date: '',
    time: '',
    patientId: '',
    staffId: '',
    type: '',
  });

  const chartTypeRef = useRef(null);
  const chartStaffIdRef = useRef(null);

  const createChart = useCallback((ref, data) => {
    const ctx = ref.current.getContext('2d');
    return new Chart(ctx, {
      type: 'doughnut',
      data: data,
    });
  }, []);

  const destroyChart = useCallback((chart, ref) => {
    if (chart) {
      chart.destroy();
      ref.current.getContext('2d').clearRect(0, 0, ref.current.width, ref.current.height);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  useEffect(() => {
    const typeCount = appointments.reduce((count, appointment) => {
      count[appointment.type] = (count[appointment.type] || 0) + 1;
      return count;
    }, {});

    const staffIdCount = appointments.reduce((count, appointment) => {
      count[appointment.staffId] = (count[appointment.staffId] || 0) + 1;
      return count;
    }, {});

    const typeLabels = Object.keys(typeCount);
    const typeData = Object.values(typeCount);

    const staffIdLabels = Object.keys(staffIdCount);
    const staffIdData = Object.values(staffIdCount);

    const newTypeChart = createChart(chartTypeRef, {
      labels: typeLabels,
      datasets: [
        {
          data: typeData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    const newStaffIdChart = createChart(chartStaffIdRef, {
      labels: staffIdLabels,
      datasets: [
        {
          data: staffIdData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    return () => {
      destroyChart(newTypeChart, chartTypeRef);
      destroyChart(newStaffIdChart, chartStaffIdRef);
    };
  }, [appointments, createChart, destroyChart]);

  return (
    <div>
      <h2>Appointments</h2>

      <div>
        <h3>Type Chart</h3>
        <canvas ref={chartTypeRef} width="600" height="400"></canvas>
      </div>

      <div>
        <h3>Staff ID Chart</h3>
        <canvas ref={chartStaffIdRef} width="600" height="400"></canvas>
      </div>

      <h3>Appointments</h3>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient ID</th>
            <th>Staff ID</th>
            <th>Type</th>
            <th>Actions</th>
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

const handleEdit = (appointment) => {
  // Implement handleEdit logic
};

const handleDelete = (appointmentId) => {
  // Implement handleDelete logic
};

const saveAppointmentToServer = () => {
  // Implement saveAppointmentToServer logic
};

export default AppointmentsList;
