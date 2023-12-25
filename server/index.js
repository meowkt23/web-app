require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToMongoDB } = require('./database');
const { MongoClient, ObjectId } = require('mongodb');
const staffRoutes = require('./staff-routes');

const app = express();

// Use the cors middleware to enable CORS
app.use(cors());

// Serve static files from the client/build folder
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/api', staffRoutes);
// Add your staff routes here
app.get('/api/staff', async (req, res) => {
  try {
    // Fetch staff data from MongoDB
    const staffData = await StaffModel.find();  // Replace with your actual query

    // Send the staff data as a JSON response
    res.json(staffData);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set the GitHub URL for fetching HTML content (fallback to a default URL)
const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/public/index.html';

// Define a route for handling requests to the root path ('/')
app.get('/', async (req, res) => {
  try {
    const fetch = await import('node-fetch');
    const response = await fetch.default(githubUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch HTML from GitHub: ${response.statusText}`);
    }

    const html = await response.text();
    res.send(html);
  } catch (error) {
    console.error('Error fetching or sending HTML:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Set up a wildcard route to handle React app requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;

connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
