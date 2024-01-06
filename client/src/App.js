// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import StaffList from './StaffList';
import PatientsList from './PatientsList';
import PharmacyList from './PharmacyList.js/index.js';
import InventoryList from './InventoryList.js';
import InsuranceList from './InsuranceList';
import BillingList from './BillingList';
import AppointmentsList from './AppointmentsList';

const App = () => {
  return (
    <Router>
      <Routes> {}
        <Route path="/" element={<HomePage/>} />
        <Route path="/Staff" element={<StaffList/>} />
        <Route path="/Patients" element={<PatientsList/>} />
        <Route path="/Pharmacy" element={<PharmacyList/>} />
        <Route path="/Inventory" element={<InventoryList/>} />
        <Route path="/Insurance" element={<InsuranceList/>} />
        <Route path="/Billing" element={<BillingList/>} />
        <Route path="/Appointments" element={<AppointmentsList/>} />        
      </Routes>
    </Router>
  );
};

export default App;