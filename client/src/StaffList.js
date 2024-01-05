import React, { useState, useEffect } from 'react';

const StaffList = () => {
  //state for storing list of staff members
  const [staffMembers, setStaffMembers] = useState([]);
  //state for tracking whether user is editing
  const [isEditing, setIsEditing] = useState(false);
  //state for storing staff data being edited
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

  //fetch staff members from server
  const fetchStaffMembers = async () => {
    try {
      const response = await fetch('http://localhost:3000/staff');

      if (!response.ok) {
        throw new Error(`Failed to fetch staff members: ${response.statusText}`);
      }

      const data = await response.json();
      setStaffMembers(data);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  //function to handle editing of staff member
  const handleEdit = (staff) => {
    setIsEditing(true);
    setEditData({ ...staff });
  };

  //function to handle deletion of staff member
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/staff/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete staff member: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh staff list after deletion
      fetchStaffMembers();
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };

  //function to save edited or new staff member
  const saveStaffMemberToServer = async () => {
    const apiUrl = editData._id ? `http://localhost:3000/staff/${editData._id}` : 'http://localhost:3000/staff';
  
    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save staff member: ${response.statusText}`);
      }
  
      //reset edit data after saving
      setEditData(null);
  
      //fetch updated staff members
      fetchStaffMembers();
    } catch (error) {
      console.error('Error saving staff member:', error);
    }
  };

  return (
    <div>
      <h2>Staff Members</h2>
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

//edit form component for editing or adding new staff member
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
