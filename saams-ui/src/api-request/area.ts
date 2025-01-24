import { net } from "electron";
import { Area, AreaResponse } from "../model/area";
import { API_CONFIG, API_ENDPOINTS } from "../config";

export const getArea = async (id: number): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: `${API_ENDPOINTS.area}/${id}`,
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

export const getAreas = async (): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
        const request = net.request('https://localhost:7192/api/Area');

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
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.area,
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

        request.write(JSON.stringify(area));
        request.end();
    });
};

export const updateArea = async (area: Area): Promise<AreaResponse> => {
    return new Promise<AreaResponse>((resolve, reject) => {
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
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: `${API_ENDPOINTS.area}/${id}`,
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
