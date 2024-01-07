import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chart, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { schemeCategory10 } from 'd3-scale-chromatic';

//register ArcElement for chart.js use
Chart.register(ArcElement);

//set colour scheme to schemeCategory10
const colorScale = schemeCategory10;

const chartOptions = {
  legend: {
    display: true,
    position: 'top',
  },
};

const StaffList = () => {
  //function to reset edit data to initial state
  const resetEditData = () => {
    setEditData(initialEditData);
  };
  //initial state for editing staff data set to empty
  const initialEditData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    role: '',
    department: {
      name: '',
      site: '',
    },
  };

  //state variables
  const [editData, setEditData] = useState(initialEditData);
  const [staffMembers, setStaffMembers] = useState([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [departmentDistribution, setDepartmentDistribution] = useState({});
  const labels = Object.keys(departmentDistribution);
  const data = Object.values(departmentDistribution);
  const backgroundColor = colorScale.slice(0, labels.length);

  const [chartData, setChartData] = useState({
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColor,
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  
    //function to clear chart data
    const clearChartData = useCallback(() => {
      setChartData((prevData) => ({
        labels: Object.keys(departmentDistribution),
        datasets: [
          {
            data: Object.values(departmentDistribution),
            backgroundColor: colorScale.slice(0, Object.keys(departmentDistribution).length),
          },
        ],
      }));
    }, [departmentDistribution]);

  //function to update chart data based on department distribution
  const updateChartData = useCallback((distribution) => {
    const labels = Object.keys(distribution);
    const data = Object.values(distribution);
    const backgroundColor = colorScale.slice(0, labels.length);
  
    setChartData({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
        },
      ],
    });
  }, [setChartData]);
  
  //function to fetch staff members from server
  const fetchStaffMembers = useCallback(async () => {
    try {
      clearChartData();
      const response = await fetch('http://localhost:3000/Staff');

      if (!response.ok) {
        throw new Error(`Failed to fetch Staff members: ${response.statusText}`);
      }

      const data = await response.json();
      setStaffMembers(data);
      setTotalStaff(data.length);

      const distribution = data.reduce((acc, staff) => {
        const departmentName = staff.department.name;
        acc[departmentName] = (acc[departmentName] || 0) + 1;
        return acc;
      }, {});
      //set and update department distribution data
      setDepartmentDistribution(distribution);
      updateChartData(distribution);
    } catch (error) {
      console.error('Error fetching Staff members:', error);
    }
  }, [clearChartData, updateChartData]);

  //reference for chart
  const chartRef = useRef(null);

  //effect hook to fetch staff members when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchStaffMembers();
    };

    fetchData();

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = new Chart(chartRef.current.getContext('2d'), {
        type: 'pie',
        data: chartData,
        options: chartOptions,
      });
    }
  
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData, fetchStaffMembers]);

  //function to handle edit of staff member
  const handleEdit = (staff) => {
    setIsEditing(true);
    setEditData({ ...staff });
  };

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/Staff/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete Staff member: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      fetchStaffMembers();
    } catch (error) {
      console.error('Error deleting Staff member:', error);
    }
  };

  //function to save staff member to server
  const saveStaffMemberToServer = async () => {
    const apiUrl = editData._id ? `http://localhost:3000/Staff/${editData._id}` : 'http://localhost:3000/Staff';

    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save Staff member: ${response.statusText}`);
      }

      resetEditData();
      fetchStaffMembers();
    } catch (error) {
      console.error('Error saving Staff member:', error);
    }
  };

  //structure for rendering
  return (
    <div>
      <h2>Staff Members</h2>
      <div>
        <h3>Total Staff Members: {totalStaff}</h3>
        <h3>Staff Distribution by Department</h3>
          <Pie
            data={chartData}
            options={chartOptions}
          />
      </div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Mobile Number</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department Name</th>
            <th>Department Site</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(staffMembers) &&
            staffMembers.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.firstName}</td>
                <td>{staff.lastName}</td>
                <td>{staff.dateOfBirth}</td>
                <td>{staff.mobileNumber}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>{staff.department.name}</td>
                <td>{staff.department.site}</td>
                <td>
                  <button onClick={() => handleEdit(staff)}>Edit</button>
                  <button onClick={() => handleDelete(staff._id)}>Delete</button>
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
          saveStaffMemberToServer={saveStaffMemberToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Staff</button>
      )}
    </div>
  );
};

const EditForm = ({ editData, setEditData, setIsEditing, saveStaffMemberToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
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
          Role:
          <input type="text" name="role" value={editData.role} onChange={handleInputChange} />
        </label>
        <label>
          Department Name:
          <input type="text" name="department.name" value={editData.department.name} onChange={handleInputChange} />
        </label>
        <label>
          Department Site:
          <input type="text" name="department.site" value={editData.department.site} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={saveStaffMemberToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default StaffList;