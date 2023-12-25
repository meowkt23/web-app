require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with the actual origin of your React app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const { connectToMongoDB } = require('./database');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

// Use the cors middleware to enable CORS
app.use(cors(corsOptions));

// Serve static files from the client/build folder
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const staffRoutes = require('./staff-routes');
app.use('/api', staffRoutes);

// Set the GitHub URL for fetching HTML content (fallback to a default URL)
const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/public/index.html';

// Define a route for handling requests to the root path ('/')
app.get('/', async (req, res) => {
  try {
    // Dynamically import fetch using import()
    const fetch = await import('node-fetch');

    // Fetch HTML content from the specified GitHub URL using 'fetch' API
    const response = await fetch.default(githubUrl);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML from GitHub: ${response.statusText}`);
    }

    // Read the HTML content from the response
    const html = await response.text();

    // Send the HTML content as the response to the client
    res.send(html);
  } catch (error) {
    // Handle errors and log them
    console.error('Error fetching or sending HTML:', error);

    // Send an appropriate HTTP response for different error scenarios
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
