// App.js
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './HomePage.js';
import StaffList from './StaffList.js';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={HomePage} />
      <Route path="/staff" component={StaffList} />
    </Router>
  );
};

export default App;