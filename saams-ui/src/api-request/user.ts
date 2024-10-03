import { net } from "electron";
import { UserLogin, UserLoginResponse } from "../model/user";

const loginUser = async (json: string) => {
    let user: UserLogin = JSON.parse(json);

    const future = new Promise<UserLoginResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: 'localhost',
            port: 7192,
            path:'/api/login',
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

export default loginUser;