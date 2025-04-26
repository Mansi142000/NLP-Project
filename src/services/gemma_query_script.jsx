// This script is used to send a query to the Local Ollama server and receive a response.
// It uses the Fetch API to send a POST request to the server with the query messages and model name.
// The server is expected to be running locally on port 5000 and should have an endpoint '/run-local-gemma'.
// The model name is set to 'gemma2:2b' by default, but can be overridden by passing a different model name as an argument.
const runLocalGemmaQuery = async (messages, model = 'gemma2:2b') => {
    try {
        const response = await fetch('http://localhost:5000/run-local-gemma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages, model }) // explicitly include model
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Response from local Gemma:', result);

        return result.response || null;
    } catch (error) {
        console.error('Error querying local Gemma (Ollama):', error);
        return null;
    }
};

export default runLocalGemmaQuery;
