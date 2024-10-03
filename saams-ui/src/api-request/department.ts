import { net } from "electron";
import { Department } from "../model/department";

export const getDepartments = async () => {
    const future = await new Promise<Department[]>((resolve, reject) => {
        // Make sure the entry exists
        const request = net.request('https://localhost:7192/api/Department');
    
        request.on('response', (response) => {
            let responseData = '';
    
            response.on('data', (chunk) => {
            responseData += chunk; // Collect all data chunks
            });
    
            response.on('end', () => {
            try {
                const data = JSON.parse(responseData);
                console.log(`${data.id}`);
                resolve(data); // Resolve the promise with the id
            } catch (error) {
                reject(error); // Reject if parsing fails
            }
            console.log('no more data');
            });
        });
    
        request.on('error', (error) => {
            reject(error); // Reject the promise if there's a request error
        });
    
        request.end();
        });
    
        console.log('before the return statement');
        return future;
}