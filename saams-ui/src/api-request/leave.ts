import { net } from 'electron';
import { Leave, LeaveResponse } from '../model/leave';
import { API_CONFIG, API_ENDPOINTS } from '../config';


export const getLeaves = async (): Promise<LeaveResponse[]> => {
    return new Promise<LeaveResponse[]>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leave,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error(`Failed to parse leaves data: ${error.message}`));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error(`Request failed: ${error.message}`));
        });

        request.end();
    });
};

export const getLeave = async (id: number): Promise<LeaveResponse> => {
    return new Promise<LeaveResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: `${API_ENDPOINTS.leave}/${id}`,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error(`Failed to parse leave data: ${error.message}`));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error(`Request failed: ${error.message}`));
        });

        request.end();
    });
};

export const createLeave = async (leave: Leave): Promise<LeaveResponse> => {
    return new Promise<LeaveResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leave,
            headers: {
                ...API_CONFIG.headers,
                'Content-Type': 'application/json',
            },
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error('Failed to parse leave creation response'));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error('Request failed during leave creation'));
        });
        request.write(JSON.stringify(leave));
        request.end();
    });

};

export const updateLeave = async (leave: Leave): Promise<LeaveResponse> => {
    return new Promise<LeaveResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.leave,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error('Failed to parse leave update response'));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error('Request failed during leave update'));
        });

        request.write(JSON.stringify(leave));
        request.end();
    });
};

export const deleteLeave = async (id: number): Promise<LeaveResponse> => {
    return new Promise<LeaveResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: `${API_ENDPOINTS.leave}/${id}`,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error('Failed to parse leave deletion response'));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error('Request failed during leave deletion'));
        });

        request.end();
    });

};
