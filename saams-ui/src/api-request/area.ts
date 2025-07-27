import { net } from "electron";
import { Area, AreaResponse } from "../model/area";
import {API_ENDPOINTS } from "../config";
import { HTTP } from "../constants";
import { GlobalAuthManager } from '../global'
export const getArea = async (id: number): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: `${API_ENDPOINTS.area}/${id}`,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
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

export const getAreas = async (): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.area,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
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

export const createArea = async (area: Area): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.area,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
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
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.write(JSON.stringify(area));
        request.end();
    });
};

export const updateArea = async (area: Area): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.area,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
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
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.write(JSON.stringify(area));
        request.end();
    });
};

export const deleteArea = async (id: number): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: `${API_ENDPOINTS.area}/${id}`,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
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
