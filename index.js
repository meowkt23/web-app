// Import required modules
require('dotenv').config();
const express = require('express');
const { connectToMongoDB } = require('./database'); // Update the import statement
const { MongoClient, ObjectId } = require('mongodb');
// Create an Express application
const app = express();

// Set the GitHub URL for fetching HTML content (fallback to a default URL)
const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/index.html';

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

// Set the port for the server to listen on (use process.env.PORT or default to 3000)
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start the Express server only after the connection is established
connectToMongoDB()
  .then(() => {
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
