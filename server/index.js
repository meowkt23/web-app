//index.js sets up the Express server including middleware and route mounting

//merge environment setup
require('dotenv').config();

//import Express.js framework and connectToMongoDB from database.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectToMongoDB } = require('./database');
const staffRoutes = require('./staffRoutes');
const { staffModel } = require('./staffModel');
const patientsRoutes = require('./patientsRoutes');
const { patientsModel } = require('./patientsModel');

//create Express instance and set up server to listen on port 3000
const app = express();

//enabble CORS middleware for all routes
app.use(cors());

//middleware to parse JSON requests
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'public', 'src')));

//using the connectToMongoDB function to connect to MongoDB
connectToMongoDB()
  .then(() => {
    //check - mount staff routes under the "/staff" path
    app.use('/staff', staffRoutes);
    app.use('/patients', patientsRoutes);

    //route to fetch staff from MongoDB
    app.get('/staff', async (req, res) => {
      try {
        const staffData = await staffModel.find();
        res.json(staffData);
      } catch (error) {
        console.error('Error fetching staff members from MongoDB', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    app.get('/patients', async (req, res) => {
      try {
        const patientsData = await patientsModel.find();
        res.json(patientsData);
      } catch (error) {
        console.error('Error fetching patients from MongoDB', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    //route to fetch HTML file index.html
    const indexHtmlFilePath = path.join(__dirname, '..', 'client', 'public', 'src', 'index.html');

    app.get('/', async (req, res) => {
      try {
        //read HTML file
        const indexHtml = await fs.promises.readFile(indexHtmlFilePath, 'utf-8');
        res.send(indexHtml);
      } catch (error) {
        console.error('Error reading or sending index.html file', error);
        res.status(500), send('Internal Server Error');
      }
    });

    //start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`); //console log
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error); //error log
  });

//export to Express app
module.exports = app;