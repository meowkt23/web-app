// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Your App</h1>
      <p>Explore the staff page:</p>
      <Link to="/staff">Go to Staff Page</Link>
    </div>
  );
};

export default HomePage;