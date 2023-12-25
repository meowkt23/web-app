const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToMongoDB } = require('./database');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router(); // Use express.Router() instead of express()

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));
router.use(express.static(path.join(__dirname, '..', 'client', 'build')));

router.get('/staff', (req, res) => {
  // Handle fetching staff data from MongoDB and sending it as a response
  res.send('Staff data will be sent here');
});

const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/public/index.html';

router.get('/', async (req, res) => {
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

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;

connectToMongoDB()
  .then(() => {
    // Use router instead of app
    router.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

module.exports = router;
