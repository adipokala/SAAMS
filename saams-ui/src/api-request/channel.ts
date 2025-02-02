// channel.ts
import { net } from "electron";
import { Channel, ChannelResponse } from "../model/channel";
import { API_CONFIG, API_ENDPOINTS } from "../config";

export const getChannel = async (id: number): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: `${API_ENDPOINTS.channel}/${id}`,
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
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();
    });
};

export const getChannels = async (): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    console.log("Response data received:", responseData);  // Log raw response for debugging
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error(`Failed to parse companies data: ${error.message}`));
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
export const createChannel = async (channel: Channel): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company,
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
                    console.log("Response data received:", responseData);  // Log raw response for debugging
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error('Failed to parse channel creation response'));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error('Request failed during channel creation'));
        });

        request.write(JSON.stringify(channel));
        request.end();
    });
};

export const updateChannel = async (channel: Channel): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.channel,
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
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.write(JSON.stringify(channel));
        request.end();
    });
};

export const deleteChannel = async (id: number): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: `${API_ENDPOINTS.company}/${id}`,
            headers: API_CONFIG.headers,
        });

        request.on('response', (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                try {
                    console.log("Response data received:", responseData);  // Log raw response for debugging
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error('JSON parsing error:', error);
                    reject(new Error('Failed to parse channel deletion response'));
                }
            });
        });

        request.on('error', (error) => {
            console.error('Request error:', error);
            reject(new Error('Request failed during channel deletion'));
        });

        request.end();
    });
};
