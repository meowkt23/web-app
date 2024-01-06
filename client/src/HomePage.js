import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Healthway Hospitals Web App</h1>
      <p></p>
      <Link to="/Staff">Staff Page</Link>
      <br />
      <Link to="/Patients">Patients Page</Link>
      <br />
      <Link to="/Pharmacy">Pharmacy Page</Link>
      <br />
      <Link to="/Inventory">Inventory Page</Link>
      <br />
      <Link to="/Insurance">Insurance Page</Link>
      <br />
      <Link to="/Billing">Billing Page</Link>
      <br />
      <Link to="/Appointments">Appointments Page</Link>
    </div>
  );
};

export default HomePage;