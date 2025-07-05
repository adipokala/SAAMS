import { net } from "electron";
import { Shift, ShiftResponse } from "../model/shift";
import {  API_ENDPOINTS } from "../config";
import { GlobalAuthManager } from "../global";
import { HTTP } from "../constants";

export const getShifts = async () => {
    const future = await new Promise<ShiftResponse>((resolve, reject) => {
        // Make sure the entry exists
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.shift,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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
        });

        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });

        request.end();
    });

    return future;
}
export const getShift = async (id: number) => {
    const future = await new Promise<ShiftResponse>((resolve, reject) => {
        // Make sure the entry exists
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: `${API_ENDPOINTS.shift}/${id}`,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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
        });

        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });

        request.end();
    });

    return future;
}

export const createShift = async (shift: Shift) => {
    const future = await new Promise<ShiftResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.shift,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk; // Collect all data chunks
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    console.log(data);
                    resolve(data); // Resolve the promise with the id
                } catch (error) {
                    reject(error); // Reject if parsing fails
                }
            });

            request.on('error', (error) => {
                reject(error); // Reject the promise if there's a request error
            });
        });

        request.write(JSON.stringify(shift));

        request.end();
    });

    return future;
}

export const updateShift = async (shift: Shift) => {
    const future = await new Promise<ShiftResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.shift,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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

        request.write(JSON.stringify(shift));

        request.end();
    });

    return future;
}

export const deleteShift = async (id: number) => {
    const future = await new Promise<ShiftResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: `${API_ENDPOINTS.shift}/${id}`,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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