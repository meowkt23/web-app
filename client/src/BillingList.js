import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const BillingList = () => {
  const [billingEntries, setBillingEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
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

  const [totalChart, setTotalChart] = useState(null);
  const [insurerClaimedChart, setInsurerClaimedChart] = useState(null);

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

  useEffect(() => {
    if (billingEntries.length > 0) {
      const totalLabels = ['Total Amount Paid', 'Total Amount Pending'];
      const totalData = [
        billingEntries.reduce((sum, entry) => (entry.paymentStatus === 'Paid' ? sum + entry.amount : sum), 0),
        billingEntries.reduce((sum, entry) => (entry.paymentStatus === 'Pending' ? sum + entry.amount : sum), 0),
      ];

      const insurerClaimedLabels = ['Insurer Claimed - Yes', 'Insurer Claimed - No'];
      const insurerClaimedData = [
        billingEntries.reduce((sum, entry) => (entry.insurerClaimed && entry.paymentStatus === 'Paid' ? sum + entry.amount : sum), 0),
        billingEntries.reduce((sum, entry) => (!entry.insurerClaimed && entry.paymentStatus === 'Paid' ? sum + entry.amount : sum), 0),
      ];

      if (totalChart instanceof Chart) {
        totalChart.data.labels = totalLabels;
        totalChart.data.datasets[0].data = totalData;
        totalChart.update();
      } else {
        const newTotalChart = new Chart(document.getElementById('totalChart'), {
          type: 'bar',
          data: {
            labels: totalLabels,
            datasets: [
              {
                label: 'Total Amount',
                data: totalData,
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
              },
            ],
          },
        });
        setTotalChart(newTotalChart);
      }

      if (insurerClaimedChart instanceof Chart) {
        insurerClaimedChart.data.labels = insurerClaimedLabels;
        insurerClaimedChart.data.datasets[0].data = insurerClaimedData;
        insurerClaimedChart.update();
      } else {
        const newInsurerClaimedChart = new Chart(document.getElementById('insurerClaimedChart'), {
          type: 'bar',
          data: {
            labels: insurerClaimedLabels,
            datasets: [
              {
                label: 'Total Amount Insurer Claimed',
                data: insurerClaimedData,
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(128, 0, 128, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(128, 0, 128, 1)'],
                borderWidth: 1,
              },
            ],
          },
        });
        setInsurerClaimedChart(newInsurerClaimedChart);
      }
    }
  }, [billingEntries, totalChart, insurerClaimedChart]);

  const handleEdit = (billingEntry) => {
    setIsEditing(true);
    setEditData({ ...billingEntry });
  };

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

      fetchBillingEntries();
    } catch (error) {
      console.error('Error deleting Billing entry:', error);
    }
  };

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

      setEditData(null);
      fetchBillingEntries();
    } catch (error) {
      console.error('Error saving Billing entry:', error);
    }
  };

  return (
    <div>
      <h2>Billing</h2>

      <div>
        <h3>Total Amount Chart</h3>
        <canvas id="totalChart" width="400" height="200"></canvas>
      </div>

      <div>
        <h3>Insurer Claimed Chart</h3>
        <canvas id="insurerClaimedChart" width="400" height="200"></canvas>
      </div>

      <h3>Billing Entries</h3>

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
