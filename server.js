// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Import database connection
require('./database');

//Import models
const Staff = require('./staff');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set the GitHub URL for fetching HTML content (fallback to a default URL)
const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/index.html';

// Define a route for handling requests to the root path ('/')
app.get('/', async (req, res) => {
    try {
        // Dynamically import 'node-fetch' using dynamic import
        const fetch = await import('node-fetch');

        // Fetch HTML content from the specified GitHub URL
        const response = await fetch.default(githubUrl); // Use fetch.default

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

// Check for specific error types and send appropriate HTTP responses
if (error instanceof fetch.FetchError || (error && error.type === 'system' && error.code === 'ECONNRESET')) {
    res.status(500).send('Network Error');
} else if (error instanceof Object && error instanceof fetch.Response && error.status === 404) {
    res.status(404).send('Not Found');
} else {
    // Log the error for further investigation
    console.error('Error:', error);

    // Handle the case where 'error' is not an object
    if (error instanceof Object) {
        res.status(500).send('Internal Server Error');
    } else {
        res.status(500).send('Unknown Error');
    }
}

    }
});

// Set the port for the server to listen on (use process.env.PORT or default to 3000)
const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
