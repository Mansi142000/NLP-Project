import express from 'express';
import { spawn } from 'child_process';

const app = express();
const port = 5000;

app.use(express.json());

app.get('/run-query', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send('Query parameter is required.');
    }

    const pythonProcess = spawn('python', ['./../python-scripts/query_chroma_db.py', query]);

    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send('Failed to run python script');
        }
        res.json({ result: data });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
