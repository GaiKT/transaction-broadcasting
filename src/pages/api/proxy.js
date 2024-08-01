import axios from 'axios';

export default async function handler(req, res) {
    const { method, body, query, headers, url } = req
    
    let targetApiBaseUrl = ''
    // Target API base URL
    if(method == 'POST'){
        targetApiBaseUrl = 'https://mock-node-wgqbnxruha-as.a.run.app/broadcast'; // If get POST medtod replace with your target API
    }else if(method == 'GET'){
        targetApiBaseUrl = 'https://mock-node-wgqbnxruha-as.a.run.app/check/' + query.id; // If get GET medtod replace with your target API
    }


    // Remove the "/api/proxy" part from the url to forward the correct path to the target API
    const targetUrl = url.replace('/api/proxy', '');

    try {
        // Forward the request to the target API
        const response = await axios({
            method: method,
            url: `${targetApiBaseUrl}${targetUrl}`,
            data: body,
            headers: {
                // Forward headers if needed, such as Authorization
                ...headers,
                host: undefined, // Remove the host header
            },
        });

        // Send the response back to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        // Handle errors
        res.status(error.response ? error.response.status : 500).json({
            message: error.message,
            ...(error.response ? error.response.data : {}),
        });
    }
}
