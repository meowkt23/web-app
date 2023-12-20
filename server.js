const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());

const staff = require('./staff');

app.get('/staff', async (req, res) => {
    const staff = await staff.find();
    res.json(appointments);
});

const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: staticPath });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static('public'));