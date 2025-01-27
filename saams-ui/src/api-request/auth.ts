import { net } from "electron";
import { API_CONFIG, API_ENDPOINTS } from "../config";
import { UserLogin, UserResponse } from "../model/user";

export const loginUser = async (json: string) => {
    let user: UserLogin = JSON.parse(json);

    const future = new Promise<UserResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: 7192,
            path: API_ENDPOINTS.login,
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