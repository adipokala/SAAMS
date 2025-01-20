import { net } from "electron";
import { Area, AreaResponse } from "../model/area";
import { API_CONFIG, API_ENDPOINTS } from "../config";

export const getAreas = async () => {
    const future = await new Promise<AreaResponse>((resolve, reject) => {
        // Make sure the entry exists
        const request = net.request('https://localhost:7192/api/Area');

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk; // Collect all data chunks
            });

            response.on('end', () => {
                try {
                    console.log(responseData);
                    const data = JSON.parse(responseData);
                    console.log(`${data.id}`);
                    resolve(data); // Resolve the promise with the id
                } catch (error) {
                    reject(error); // Reject if parsing fails
                }
                console.log('no more data');
            });
        });

        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });

        request.end();
    });

    console.log('before the return statement');
    return future;
}

export const createArea = async (area: Area) => {
    const future = await new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.area,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk; // Collect all data chunks
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data); // Resolve the promise with the id
                } catch (error) {
                    reject(error); // Reject if parsing fails
                }
            });

            request.on('error', (error) => {
                reject(error); // Reject the promise if there's a request error
            });
        });

        request.write(JSON.stringify(area));

        request.end();
    });

    return future;
}

export const updateArea = async (area: Area) => {
    const future = await new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.area,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk; // Collect all data chunks
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data); // Resolve the promise with the id
                } catch (error) {
                    reject(error); // Reject if parsing fails
                }
            });

            request.on('error', (error) => {
                reject(error); // Reject the promise if there's a request error
            });
        });

        request.write(JSON.stringify(area));

        request.end();
    });

    return future;
}

export const deleteArea = async (id: number) => {
    const future = await new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.area + `/${id}`,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk; // Collect all data chunks
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data); // Resolve the promise with the id
                } catch (error) {
                    reject(error); // Reject if parsing fails
                }
            });

            request.on('error', (error) => {
                reject(error); // Reject the promise if there's a request error
            });
        });

        request.end();
    });

    return future;
}