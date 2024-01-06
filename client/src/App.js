// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update the import statement
import HomePage from './homePage';
import staffList from './staffList';
import patientsList from './patientsList';

const App = () => {
  return (
    <Router>
      <Routes> {}
        <Route path="/" element={<HomePage />} />
        <Route path="/Staff" element={<staffList />} />
        <Route path="/Patients" element={<patientsList />} />
      </Routes>
    </Router>
  );
};

export default App;