// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import StaffList from './StaffList';
import PatientsList from './PatientsList';

const App = () => {
  return (
    <Router>
      <Routes> {}
        <Route path="/" element={<HomePage/>} />
        <Route path="/Staff" element={<StaffList/>} />
        <Route path="/Patients" element={<PatientsList/>} />
      </Routes>
    </Router>
  );
};

export default App;