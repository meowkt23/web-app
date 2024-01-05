import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Healthway Hospitals Web App</h1>
      <p></p>
      <Link to="/staff">Staff Page</Link>
    </div>
  );
};

export default HomePage;