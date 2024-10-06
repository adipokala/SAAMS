import { net } from "electron";

const handleGetDesignations = () => {
    

    const request = net.request({
        method: 'GET',
        protocol: 'https:',
        hostname: 'localhost',
        port: 7192,
        path:'/api/designation',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    let responseData = '';

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            responseData += chunk;
        });
    });

    request.end();

    return responseData;
};

export default handleGetDesignations;