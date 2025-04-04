import React, { useState } from 'react';

const QueryComponent = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChromaQuery = async (query) => {
        setIsLoading(true);
        setError(''); // Reset previous errors
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`http://localhost:5000/run-query?query=${encodedQuery}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result.result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div>
            <button onClick={()=>{handleChromaQuery("I am cat meow meow")}} 
            > Hello there</button>
            {data && <div>Result: {data}</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </div>
    );
};

export default QueryComponent;
