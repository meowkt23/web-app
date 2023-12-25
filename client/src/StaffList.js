import React, { useState, useEffect } from 'react';

const StaffList = () => {
  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    // Fetch data from your Express API
    fetch('http://localhost:3000/api/staff')
      .then((response) => response.json())
      .then((data) => setStaffMembers(data))
      .catch((error) => console.error('Error fetching staff members:', error));
  }, []);

  return (
    <div>
      <h2>Staff Members</h2>
      <ul>
        {Array.isArray(staffMembers) &&
          staffMembers.map((staff) => (
            <li key={staff._id}>{`${staff.firstName} ${staff.lastName}`}</li>
          ))}
      </ul>
    </div>
  );
};

export default StaffList;