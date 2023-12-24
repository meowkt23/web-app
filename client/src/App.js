// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update the import statement
import HomePage from './HomePage';
import StaffList from './StaffList';

const App = () => {
  return (
    <Router>
      <Routes> {/* Wrap your routes with the Routes component */}
        <Route path="/" element={<HomePage />} />
        <Route path="/staff" element={<StaffList />} />
      </Routes>
    </Router>
  );
};

export default App;