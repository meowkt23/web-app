const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToMongoDB } = require('./database');
const { StaffModel } = require('./staff-model');  // Import StaffModel
const fetch = require('node-fetch');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));
router.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Fetch and return staff data from MongoDB
router.get('/staff', async (req, res) => {
  try {
    const staffMembers = await StaffModel.find({}, {
      _id: 1,
      staffId: 1,
      firstName: 1,
      lastName: 1,
      dateOfBirth: 1,
      mobileNumber: 1,
      email: 1,
      role: 1,
      'department.name': 1,
      'department.site': 1,
    });

    res.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/public/index.html';

router.get('/', async (req, res) => {
  try {
    const response = await fetch(githubUrl);

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
    router.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

module.exports = router;
