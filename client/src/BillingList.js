import React, { useState, useEffect } from 'react';

const BillingList = () => {
  // state for storing list of Billing entries
  const [billingEntries, setBillingEntries] = useState([]);
  // state for tracking whether user is editing
  const [isEditing, setIsEditing] = useState(false);
  // state for storing billing entry data being edited
  const [editData, setEditData] = useState({
    date: '',
    time: '',
    patientId: '',
    staffId: '',
    amount: 0,
    paymentStatus: '',
    insurerClaimed: false,
    insurerId: '',
    billingDetails: [
      {
        service: '',
        charge: 0,
      },
    ],
  });

  // fetch Billing entries from the server
  const fetchBillingEntries = async () => {
    try {
      const response = await fetch('http://localhost:3000/billing');

      if (!response.ok) {
        throw new Error(`Failed to fetch Billing entries: ${response.statusText}`);
      }

      const data = await response.json();
      setBillingEntries(data);
    } catch (error) {
      console.error('Error fetching Billing entries:', error);
    }
  };

  useEffect(() => {
    fetchBillingEntries();
  }, []);

  // function to handle editing of Billing entry
  const handleEdit = (billingEntry) => {
    setIsEditing(true);
    setEditData({ ...billingEntry });
  };

  // function to handle deletion of Billing entry
  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/billing/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete Billing entry: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);

      // refresh Billing entry list after deletion
      fetchBillingEntries();
    } catch (error) {
      console.error('Error deleting Billing entry:', error);
    }
  };

  // function to save edited or new Billing entry
  const saveBillingEntryToServer = async () => {
    const apiUrl = editData._id
      ? `http://localhost:3000/billing/${editData._id}`
      : 'http://localhost:3000/billing';

    try {
      const response = await fetch(apiUrl, {
        method: editData._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save Billing entry: ${response.statusText}`);
      }

      // reset edit data after saving
      setEditData(null);

      // fetch updated Billing entries
      fetchBillingEntries();
    } catch (error) {
      console.error('Error saving Billing entry:', error);
    }
  };

  return (
    <div>
      <h2>Billing</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient ID</th>
            <th>Staff ID</th>
            <th>Amount</th>
            <th>Payment Status</th>
            <th>Insurer Claimed</th>
            <th>Insurer ID</th>
            <th>Billing Details</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(billingEntries) &&
            billingEntries.map((billingEntry) => (
              <tr key={billingEntry._id}>
                <td>{billingEntry.date}</td>
                <td>{billingEntry.time}</td>
                <td>{billingEntry.patientId}</td>
                <td>{billingEntry.staffId}</td>
                <td>{billingEntry.amount}</td>
                <td>{billingEntry.paymentStatus}</td>
                <td>{billingEntry.insurerClaimed ? 'Yes' : 'No'}</td>
                <td>{billingEntry.insurerId}</td>
                <td>
                  <ul>
                    {billingEntry.billingDetails.map((detail, index) => (
                      <li key={index}>
                        {detail.service} - ${detail.charge}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => handleEdit(billingEntry)}>Edit</button>
                  <button onClick={() => handleDelete(billingEntry._id)}>Delete</button>
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
          saveBillingEntryToServer={saveBillingEntryToServer}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Add New Billing Entry</button>
      )}
    </div>
  );
};

// edit form component for editing or adding new Billing entry
const EditForm = ({ editData, setEditData, setIsEditing, saveBillingEntryToServer }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setEditData((prevData) => {
      const updatedDetails = [...prevData.billingDetails];
      updatedDetails[index][field] = value;
      return { ...prevData, billingDetails: updatedDetails };
    });
  };

  const addNewDetail = () => {
    setEditData((prevData) => ({
      ...prevData,
      billingDetails: [
        ...prevData.billingDetails,
        {
          service: '',
          charge: 0,
        },
      ],
    }));
  };

  const removeDetail = (index) => {
    setEditData((prevData) => {
      const updatedDetails = [...prevData.billingDetails];
      updatedDetails.splice(index, 1);
      return { ...prevData, billingDetails: updatedDetails };
    });
  };

  return (
    <div>
      <h3>{editData._id ? 'Edit Billing Entry' : 'Add New Billing Entry'}</h3>
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
          Amount:
          <input type="number" name="amount" value={editData.amount} onChange={handleInputChange} />
        </label>
        <label>
          Payment Status:
          <input type="text" name="paymentStatus" value={editData.paymentStatus} onChange={handleInputChange} />
        </label>
        <label>
          Insurer Claimed:
          <input
            type="checkbox"
            name="insurerClaimed"
            checked={editData.insurerClaimed}
            onChange={() => handleInputChange({ target: { name: 'insurerClaimed', value: !editData.insurerClaimed } })}
          />
        </label>
        <label>
          Insurer ID:
          <input type="text" name="insurerId" value={editData.insurerId} onChange={handleInputChange} />
        </label>
        <label>
          Billing Details:
          <ul>
            {editData.billingDetails.map((detail, index) => (
              <li key={index}>
                <label>
                  Service:
                  <input
                    type="text"
                    value={detail.service}
                    onChange={(e) => handleDetailChange(index, 'service', e.target.value)}
                  />
                </label>
                <label>
                  Charge:
                  <input
                    type="number"
                    value={detail.charge}
                    onChange={(e) => handleDetailChange(index, 'charge', e.target.value)}
                  />
                </label>
                <button type="button" onClick={() => removeDetail(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={addNewDetail}>
            Add Detail
          </button>
        </label>
        <button type="button" onClick={saveBillingEntryToServer}>
          Save
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default BillingList;