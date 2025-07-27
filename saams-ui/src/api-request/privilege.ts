import { net } from "electron";
import { Privilege, PrivilegeResponse } from "../model/privilege";
import { API_ENDPOINTS } from "../config";
import { GlobalAuthManager } from "../global";
import { HTTP } from "../constants";

export const getPrivileges = async () => {
    const future = await new Promise<PrivilegeResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.privilege,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
        });

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
export const getPrivilege = async (id: number) => {
    const future = await new Promise<PrivilegeResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: `${API_ENDPOINTS.privilege}/${id}`,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
        });
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

export const createPrivilege = async (privilege: Privilege) => {
    const future = await new Promise<PrivilegeResponse>((resolve, reject) => {
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.privilege,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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

        request.write(JSON.stringify(privilege));

        request.end();
    });

    return future;
}

export const updatePrivilege = async (privilege: Privilege) => {
    const future = await new Promise<PrivilegeResponse>((resolve, reject) => {
        const request = net.request({
            method: 'PUT',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: API_ENDPOINTS.privilege,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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

        request.write(JSON.stringify(privilege));

        request.end();
    });

    return future;
}

export const deletePrivilege = async (id: number) => {
    const future = await new Promise<PrivilegeResponse>((resolve, reject) => {
        const request = net.request({
            method: 'DELETE',
            protocol: 'https:',
            hostname: HTTP.hostname,
            port: HTTP.port,
            path: `${API_ENDPOINTS.privilege}/${id}`,
            headers: {
                'Content-Type': HTTP.contentType,
                'Authorization': GlobalAuthManager.getAuthString()
            },
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