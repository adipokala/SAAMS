import { net } from "electron";
import { API_CONFIG, API_ENDPOINTS } from "../config";
import { UserLogin, UserResponse } from "../model/user";

export const loginUser = async (json: string): Promise<UserResponse> => {
    let user: UserLogin;
    
    try {
        user = JSON.parse(json);
    } catch (error) {
        throw new Error("Invalid JSON input");
    }

    return new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port, // Ensuring consistency
            path: API_ENDPOINTS.login,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let responseData = '';

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on("end", () => {
                if (!responseData.trim()) {
                    return reject(new Error("Empty response received from server"));
                }
                try {
                    const parsedResponse: UserResponse = JSON.parse(responseData);
                    resolve(parsedResponse);
                } catch (error) {
                    console.error("JSON Parsing Error:", error, "Response Data:", responseData);
                    reject(error);
                }
            });
        });

        request.on("error", (error) => {
            console.error("Request Error:", error);
            reject(error);
        });

        request.write(JSON.stringify(user));
        request.end();
    });    
};

export const changePassword = async (
    userName: string, 
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string
): Promise<UserResponse> => {
    return new Promise<UserResponse>((resolve, reject) => {
        if (newPassword !== confirmPassword) {
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
            },
        });

        let responseData = '';

        request.on('response', (response) => {
            console.log("Response Status:", response.statusCode);

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

            response.on("end", () => {
                if (!responseData.trim()) {
                    return reject(new Error("Empty response received from server"));
                }
                try {
                    const parsedResponse: UserResponse = JSON.parse(responseData);
                    resolve(parsedResponse);
                } catch (error) {
                    console.error("JSON Parsing Error:", error, "Response Data:", responseData);
                    reject(new Error(`Invalid JSON received: ${responseData}`));
                }
            });
        });

        request.on("error", (error) => {
            console.error("Request Error:", error);
            reject(new Error("Network error occurred while changing password"));
        });

        const requestBody = JSON.stringify({ userName, currentPassword, newPassword });
        console.log("Request Body:", requestBody); // Log the request body for debugging
        request.write(requestBody);
        request.end();
    });
};