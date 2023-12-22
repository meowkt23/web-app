// Import required modules
const express = require('express');
const fetch = require('node-fetch'); // Import 'node-fetch' for making HTTP requests
const connectToMongoDB = require('./database'); // Update the path accordingly

// Create an Express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set the GitHub URL for fetching HTML content (fallback to a default URL)
const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/index.html';

// Define a route for handling requests to the root path ('/')
app.get('/', async (req, res) => {
  try {
    // Fetch HTML content from the specified GitHub URL using 'fetch' API
    const response = await fetch(githubUrl);

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

// Connect to MongoDB before starting the server
connectToMongoDB()
  .then(() => {
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start the server:', error);
  });