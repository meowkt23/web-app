const express = require('express');
const app = express();
app.use(express.json());

const staff = require('./staff');

app.get('/staff', async (req, res) => {
    const staff = await staff.find();
    res.json(appointments);
});

//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log('Server running on port ${PORT}'));

//app.get('/', (req, res) => {
//    res.sendFile($ 'https://github.com/meowkt23/web-app/index.html');
//});

const path = require('path');  // Make sure to require the 'path' module

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static('public'));