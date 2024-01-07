import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    // Hardcoded username and password
    const hardcodedUsername = 'user';
    const hardcodedPassword = 'pass';

    // Check if entered credentials match the hardcoded ones
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>Welcome to Healthway Hospitals Web App</h1>
      {authenticated ? (
        <div>
          <p>You are logged in!</p>
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
      ) : (
        <div>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
