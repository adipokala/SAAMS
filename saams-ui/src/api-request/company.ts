import { net } from "electron";
import { Company, CompanyResponse } from "../model/company";
import { API_CONFIG, API_ENDPOINTS } from "../config";

// Fetch a single company by ID
export const getCompany = async (id: number): Promise<CompanyResponse> => {
  return new Promise<CompanyResponse>((resolve, reject) => {
    const request = net.request({
      method: 'GET',
      protocol: 'https:',
      hostname: API_CONFIG.hostname,
      port: API_CONFIG.port,
      path: `${API_ENDPOINTS.company}/${id}`,
      headers: API_CONFIG.headers,
    });

    request.on('response', (response) => {
      let responseData = '';
      
      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          console.log("Response data received:", responseData);  // Log raw response for debugging
          const data = JSON.parse(responseData);
          resolve(data);
        } catch (error) {
          console.error('JSON parsing error:', error);
          reject(new Error(`Failed to parse company data: ${error.message}`));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(new Error(`Request failed: ${error.message}`));
    });

    request.end();
  });
};

// Fetch all companies
export const getCompanies = async (): Promise<CompanyResponse[]> => {
  return new Promise<CompanyResponse[]>((resolve, reject) => {
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
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          console.log("Response data received:", responseData);  // Log raw response for debugging
          const data = JSON.parse(responseData);
          resolve(data);
        } catch (error) {
          console.error('JSON parsing error:', error);
          reject(new Error(`Failed to parse companies data: ${error.message}`));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(new Error(`Request failed: ${error.message}`));
    });

    request.end();
  });
};

// Create a new company
export const createCompany = async (company: Company): Promise<CompanyResponse> => {
  return new Promise<CompanyResponse>((resolve, reject) => {
    const request = net.request({
      method: 'POST',
      protocol: 'https:',
      hostname: API_CONFIG.hostname,
      port: API_CONFIG.port,
      path: API_ENDPOINTS.company,
      headers: {
        ...API_CONFIG.headers,
        'Content-Type': 'application/json',
      },
    });

    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          console.log("Response data received:", responseData);  // Log raw response for debugging
          const data = JSON.parse(responseData);
          resolve(data);
        } catch (error) {
          console.error('JSON parsing error:', error);
          reject(new Error('Failed to parse company creation response'));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(new Error('Request failed during company creation'));
    });

    request.write(JSON.stringify(company));
    request.end();
  });
};

// Update an existing company
export const updateCompany = async (company: Company): Promise<CompanyResponse> => {
  return new Promise<CompanyResponse>((resolve, reject) => {
    const request = net.request({
      method: 'PUT',
      protocol: 'https:',
      hostname: API_CONFIG.hostname,
      port: API_CONFIG.port,
      path: `${API_ENDPOINTS.company}/${company.id}`,
      headers: {
        ...API_CONFIG.headers,
        'Content-Type': 'application/json',
      },
    });

    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          console.log("Response data received:", responseData);  // Log raw response for debugging
          const data = JSON.parse(responseData);
          resolve(data);
        } catch (error) {
          console.error('JSON parsing error:', error);
          reject(new Error('Failed to parse company update response'));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(new Error('Request failed during company update'));
    });

    request.write(JSON.stringify(company));
    request.end();
  });
};

// Delete a company by ID
export const deleteCompany = async (id: number): Promise<CompanyResponse> => {
  return new Promise<CompanyResponse>((resolve, reject) => {
    const request = net.request({
      method: 'DELETE',
      protocol: 'https:',
      hostname: API_CONFIG.hostname,
      port: API_CONFIG.port,
      path: `${API_ENDPOINTS.company}/${id}`,
      headers: API_CONFIG.headers,
    });

    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          console.log("Response data received:", responseData);  // Log raw response for debugging
          const data = JSON.parse(responseData);
          resolve(data);
        } catch (error) {
          console.error('JSON parsing error:', error);
          reject(new Error('Failed to parse company deletion response'));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(new Error('Request failed during company deletion'));
    });

    request.end();
  });
};
