import { net } from "electron";
import { API_CONFIG, API_ENDPOINTS } from "../config";
import { User, UserResponse } from "../model/user";

export const getUsers = async () => {
    const future = await new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.user,
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
    
        return future;
}

export const createUser = async (user: User) => {
    const future = await new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.user,
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

        request.write(JSON.stringify(user));
    
        request.end();
    });

    return future;
}

export const updateUser = async (user: User) => {
    const future = await new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.user,
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

        request.write(JSON.stringify(user));
    
        request.end();
    });

    return future;
}

export const deleteUser = async (id: number) => {
    const future = await new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.user + `/${id}`,
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

// New function to change password
export const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
    const future = await new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.changePassword, // Ensure this endpoint exists
            headers: {
                'Content-Type': 'application/json'
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

            request.on('error', (error) => {
                reject(error); 
            });
        });

        request.write(JSON.stringify({ userId, currentPassword, newPassword }));
        request.end();
    });

    return future;
}
