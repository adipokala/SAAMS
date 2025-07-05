import { net } from 'electron';
import { LeaveCounter, LeaveCounterResponse } from '../model/leave-counter';
import { API_CONFIG, API_ENDPOINTS } from '../config';

export const getLeaveCounters = async (): Promise<LeaveCounterResponse> => {
    return new Promise<LeaveCounterResponse>((resolve, reject) => {
        const request = net.request('https://localhost:7192/api/leave-counter');

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    if (!responseData || responseData.trim() === '') {
                        return reject(new Error('Empty response from server'));
                    }

                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parse error:', error);
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            console.error('Network request error:', error);
            reject(error);
        });

        request.end();
    });
};


export const getLeaveCounter = async (id: number): Promise<LeaveCounterResponse> => {
    return new Promise<LeaveCounterResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leaveCounter + `/${id}`,
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
        });

        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });

        request.end();
    });

};

export const createLeaveCounter = async (leaveCounter: LeaveCounter): Promise<LeaveCounterResponse> => {
    return new Promise<LeaveCounterResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leaveCounter,
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
        });

        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });

        request.write(JSON.stringify(leaveCounter)); // Send the leaveCounter data
        request.end();
    });

};


export const updateLeaveCounter = async (leaveCounter: LeaveCounter): Promise<LeaveCounterResponse> => {
    return new Promise<LeaveCounterResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leaveCounter,
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
        });

        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });
        request.write(JSON.stringify(leaveCounter)); // Send the leaveCounter data
        request.end();
    });
};

export const deleteLeaveCounter = async (id: number): Promise<LeaveCounterResponse> => {
    return new Promise<LeaveCounterResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leaveCounter + `/${id}`,
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
};









