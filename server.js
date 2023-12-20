const express = require('express');
const app = express();
app.use(express.json());

const staff = require('./staff');

app.get('/staff', async (req, res) => {
    const staff = await staff.find();
    res.json(appointments);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));

app.get('/', (req, res) => {
    res.sendFile(__direname + 'index.html');
});

app.use(express.static('public'));