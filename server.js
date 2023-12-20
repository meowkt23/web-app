import express from 'express';
import fetch from 'node-fetch';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const app = express();

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/meowkt23/web-app/main/index.html');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch HTML from GitHub: ${response.statusText}`);
        }

        const html = await response.text();
        res.send(html);
    } catch (error) {
        console.error('Error fetching HTML from GitHub:', error.message);

        if (error instanceof fetch.FetchError || error.type === 'system' || error.code === 'ECONNRESET') {
            res.status(500).send('Network Error');
        } else if (response && response.status === 404) {
            res.status(404).send('Not Found');
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});