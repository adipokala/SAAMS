import { net } from "electron";
import { Company, CompanyResponse } from "../model/company";
import { API_CONFIG, API_ENDPOINTS } from "../config";

export const getCompanies = async () => {
    const future = await new Promise<CompanyResponse>((resolve, reject) => {
        // Make sure the entry exists
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company,
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
 export const getCompany = async (id: number) => {
    const future = await new Promise<CompanyResponse>((resolve, reject) => {
        // Make sure the entry exists
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company + `/${id}`,
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

export const createCompany = async (company: Company) => {
    const future = await new Promise<CompanyResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company,
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

        request.write(JSON.stringify(company));
    
        request.end();
    });

    return future;
}

export const updateCompany = async (company: Company) => {
    const future = await new Promise<CompanyResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company,
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

        request.write(JSON.stringify(company));
    
        request.end();
    });

    return future;
}

export const deleteCompany = async (id: number) => {
    const future = await new Promise<CompanyResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: API_CONFIG.hostname,
            port: API_CONFIG.port,
            path: API_ENDPOINTS.company + `/${id}`,
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