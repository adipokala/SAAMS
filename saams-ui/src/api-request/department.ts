import { net } from "electron";
import { Department, DepartmentResponse } from "../model/department";
import { API_CONFIG, API_ENDPOINTS } from "../config";

export const getDepartments = async () => {
    const future = await new Promise<DepartmentResponse>((resolve, reject) => {
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
 export const getDepartment = async (id: number) => {
    const future = await new Promise<DepartmentResponse>((resolve, reject) => {
    const request = net.request({
        method: 'POST',
        protocol: 'https:',
        hostname: API_CONFIG.hostname,
        port: API_CONFIG.port,
        path: API_ENDPOINTS.department+`/${id}`,
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

export const createDepartment = async (department: Department) => {
    const future = await new Promise<DepartmentResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.department,
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

        request.write(JSON.stringify(department));
    
        request.end();
    });

    return future;
}

export const updateDepartment = async (department: Department) => {
    const future = await new Promise<DepartmentResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.department,
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

        request.write(JSON.stringify(department));
        
        request.end();
    });

    return future;
}

export const deleteDepartment = async (id: number) => {
    const future = await new Promise<DepartmentResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.department + `/${id}`,
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