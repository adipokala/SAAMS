import { net } from "electron";
import { API_CONFIG, API_ENDPOINTS } from "../config";
import { User, UserLogin, UserResponse } from "../model/user";

export const loginUser = async (json: string) => {
    let user: UserLogin = JSON.parse(json);

    const future = new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: 7192,
            path: API_ENDPOINTS.loginEP,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        let responseData = '';
    
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on("end", () => {
                try {
                    const response = JSON.parse(responseData);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            })
        });

        request.on("error", (error) => {
            reject(error);
        })
    
        request.write(JSON.stringify(user));
    
        request.end();
    });    

    return future;
}

export const getUsers = async () => {
    const future = await new Promise<UserResponse>((resolve, reject) => {
        // Make sure the entry exists
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