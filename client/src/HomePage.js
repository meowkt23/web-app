import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Healthway Hospitals Web App</h1>
      <p></p>
      <Link to="/Staff">Staff Page</Link>
      <Link to="/Patients">Patients Page</Link>
    </div>
  );
};

export default HomePage;