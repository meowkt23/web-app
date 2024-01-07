import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js';

const StaffList = () => {
  const [StaffMembers, setStaffMembers] = useState([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [departmentDistribution, setDepartmentDistribution] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'red', 'blue', 'green', 'purple', 'yellow', 'orange'
        ],
      },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
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
  });

  //fetch Staff members from server
  const fetchStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:3000/Staff');

      if (!response.ok) {
        throw new Error(`Failed to fetch Staff members: ${response.statusText}`);
      }

      const data = await response.json();
      //update total staff
      setStaffMembers(data);
      //calculation for total staff members
      setTotalStaff(data.length);
      //calculation for staff distribution across departments
      const distribution = data.reduce((acc, staff) => {
        const departmentName = staff.department.name;
        acc[departmentName] = (acc[departmentName] || 0) + 1;
        return acc;
      }, {});
      setDepartmentDistribution(distribution);
      //update chart data
      setChartData({
        labels: Object.keys(distribution),
        datasets: [
          {
            data: Object.values(distribution),
            backgroundColor: [
              'red', 'blue', 'green', 'purple', 'yellow', 'orange'
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching Staff members:', error);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  //function to handle editing of Staff member
  const handleEdit = (Staff) => {
    setIsEditing(true);
    setEditData({ ...Staff });
  };

  //function to handle deletion of Staff member
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

      // refresh Staff list after deletion
      fetchStaffMembers();
    } catch (error) {
      console.error('Error deleting Staff member:', error);
    }
  };

  //function to save edited or new Staff member
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
  
      //reset edit data after saving
      setEditData(null);
  
      //fetch updated Staff members
      fetchStaffMembers();
    } catch (error) {
      console.error('Error saving Staff member:', error);
    }
  };

  return (
    <div>
      <h2>Staff Members</h2>
      <div>
        <h3>Total Staff Members: {totalStaff}</h3>
        <h3>Staff Distribution by Department</h3>
        {Object.keys(departmentDistribution).length > 0 && (
          <Pie data={chartData} />
        )}
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
          {Array.isArray(StaffMembers) &&
            StaffMembers.map((Staff) => (
              <tr key={Staff._id}>
                <td>{Staff.firstName}</td>
                <td>{Staff.lastName}</td>
                <td>{Staff.dateOfBirth}</td>
                <td>{Staff.mobileNumber}</td>
                <td>{Staff.email}</td>
                <td>{Staff.role}</td>
                <td>{Staff.department.name}</td>
                <td>{Staff.department.site}</td>
                <td>
                  <button onClick={() => handleEdit(Staff)}>Edit</button>
                  <button onClick={() => handleDelete(Staff._id)}>Delete</button>
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

//edit form component for editing or adding new Staff member
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
