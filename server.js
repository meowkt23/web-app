const express = require('express');
const app = express();
app.use(express.json());

const staff = require('./staff');

app.get('/staff', async (req, res) => {
    const staff = await staff.find();
    res.json(appointments);
});

app.get('/', (req, res) => {
    res.sendFile('https://raw.https://github.com/meowkt23/web-app/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static('public'));