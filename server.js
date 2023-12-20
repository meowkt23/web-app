import express from 'express';
import fetch from 'node-fetch';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const app = express();

app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://github.com/meowkt23/web-app/index.html');
        const html = await response.text();
        res.send(html);
    } catch (error) {
        console.error('Error fetching HTML from GitHub:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static('public'));