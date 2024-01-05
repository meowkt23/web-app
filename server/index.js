require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToMongoDB } = require('./database');
const staffRoutes = require('./staff-routes');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.use('', staffRoutes);
app.get('staff', async (req, res) => {
  try {
    const staffData = await staffModel.find();
    res.json(staffData);
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const githubUrl = process.env.GITHUB_URL || 'https://raw.githubusercontent.com/meowkt23/web-app/main/public/index.html';

app.get('/', async (req, res) => {
  try {
    const fetch = await require('node-fetch');
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();

module.exports = app;
