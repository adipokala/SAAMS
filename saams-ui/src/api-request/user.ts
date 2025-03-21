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

export const changePassword = async (userName: string, currentPassword: string, newPassword: string, confirmPassword: string) => {
    return new Promise<UserResponse>((resolve, reject) => {
        if (newPassword !== confirmPassword) 
        {
            console.log(newPassword);
            console.log(confirmPassword);
            reject(new Error("New password and confirm password do not match"));
            return;
        }

        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.password, // Updated to use the correct endpoint
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...API_CONFIG.headers,
            },
        });

        let responseData = '';

        request.on('response', (response) => {
            console.log("Response Status:", response.statusCode);
            console.log("Response Headers:", response.headers);

            // Handle non-200 status codes
            if (response.statusCode !== 200) {
                response.on('end', () => {
                    reject(new Error(`Request failed with status code: ${response.statusCode}`));
                });
                return;
            }

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                console.log("Raw response data:", responseData);

                if (!responseData.trim()) {  
                    reject(new Error("Empty response received from server"));
                    return;
                }

                try {
                    const parsedData = JSON.parse(responseData);
                    if (!parsedData || typeof parsedData !== "object") {
                        reject(new Error("Invalid JSON format received"));
                        return;
                    }
                    resolve(parsedData);
                } catch (error) {
                    console.error("JSON Parsing Error:", error, "Response Data:", responseData);
                    reject(new Error(`Invalid JSON received: ${responseData}`));
                }
            });
        });

        request.on('error', (error) => {
            console.error("Request Error:", error);
            reject(new Error("Network error occurred while changing password"));
        });

        // Correct request body to match Swagger documentation
        const requestBody = JSON.stringify({ userName, currentPassword, newPassword });
        console.log("Request Body:", requestBody); // Log the request body for debugging
        request.write(requestBody);
        request.end();
    });
};