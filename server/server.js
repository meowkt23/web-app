const express = require('express');
const { connectToMongoDB } = require('./database');
const staffRoutes = require('./staff-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    // Use staff routes
    app.use('/api', staffRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });