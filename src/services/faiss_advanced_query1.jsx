// This script is used to send a query to the flask server and receive a response.
// It uses the Fetch API to make a POST request to the server with the query data.
// The server is expected to be running locally on port 5000 and should have an endpoint '/advanced-query-search'.

const handleAdvancedQuerySearch = async ({
    positive_query,
    negative_query = null,
    top_k = 10,
    search_batch_size = 200,
    row_checker = {},
    alpha = 1.0,
    beta = 1.0,
    model_choice = '1' 
}) => {
    try {
        console.log('Running advanced query search with parameters:', {
            positive_query,
            negative_query, 
            top_k,
            search_batch_size,
            row_checker,
            alpha,
            beta,
            model_choice
        });

        const response = await fetch('http://localhost:5000/advanced-query-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                positive_query,
                negative_query,
                top_k,
                search_batch_size,
                row_checker,
                alpha,
                beta,
                model_choice  
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error running advanced query search:', error);
        return null;
    }
};

export default handleAdvancedQuerySearch;
