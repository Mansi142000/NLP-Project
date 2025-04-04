import express from 'express';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import cors from 'cors';

// Initialize dotenv to use variables from .env file
dotenv.config();


const app = express();
const port = process.env.PORT || 5000; // Use port from environment or default to 5000

app.use(express.json());
app.use(cors()); 

app.get('/run-query', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send('Query parameter is required.');
    }

    // Use the PYTHON_PATH from the .env file
    const pythonExecutable = process.env.PYTHON_PATH;
    if (!pythonExecutable) {
        return res.status(500).send('Python executable path is not defined in the environment variables.');
    }

    const pythonProcess = spawn(pythonExecutable, ['./python-scripts/query_chroma_db.py', query]);

    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Process exited with code ${code}`);
            return res.status(500).send('Failed to run python script');
        }
        res.json({ result: data });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
