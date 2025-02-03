// channel-api.ts
import { net } from "electron";
import { Channel } from "../model/channel";
import { ChannelResponse } from "../model/channel";

const API_BASE_URL = "https://localhost:7192/api/Channel";
const HEADERS = {
    "Content-Type": "application/json"
};

// Fetch all channels
export const getChannels = async (): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request(API_BASE_URL);

        request.on("response", (response) => {
            let responseData = "";

            response.on("data", (chunk) => { responseData += chunk; });
            response.on("end", () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error("JSON parsing error:", error);
                    reject(new Error("Failed to parse response"));
                }
            });
        });

        request.on("error", (error) => {
            console.error("Request error:", error);
            reject(error);
        });

        request.end();
    });
};

// Create a new channel
export const createChannel = async (channel: Channel): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: "POST",
            url: API_BASE_URL,
            headers: HEADERS
        });

        request.on("response", (response) => {
            let responseData = "";
            response.on("data", (chunk) => { responseData += chunk; });
            response.on("end", () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error("JSON parsing error:", error);
                    reject(new Error("Failed to parse response"));
                }
            });
        });

        request.on("error", (error) => {
            console.error("Request error:", error);
            reject(error);
        });

        request.write(JSON.stringify(channel));
        request.end();
    });
};

// Update an existing channel
export const updateChannel = async (channel: Channel): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: "PUT",
            url: `${API_BASE_URL}/${channel.id}`,
            headers: HEADERS
        });

        request.on("response", (response) => {
            let responseData = "";
            response.on("data", (chunk) => { responseData += chunk; });
            response.on("end", () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error("JSON parsing error:", error);
                    reject(new Error("Failed to parse response"));
                }
            });
        });

        request.on("error", (error) => {
            console.error("Request error:", error);
            reject(error);
        });

        request.write(JSON.stringify(channel));
        request.end();
    });
};

// Delete a channel
export const deleteChannel = async (id: number): Promise<ChannelResponse> => {
    return new Promise<ChannelResponse>((resolve, reject) => {
        const request = net.request({
            method: "DELETE",
            url: `${API_BASE_URL}/${id}`,
            headers: HEADERS
        });

        request.on("response", (response) => {
            let responseData = "";
            response.on("data", (chunk) => { responseData += chunk; });
            response.on("end", () => {
                try {
                    const data = JSON.parse(responseData);
                    resolve(data);
                } catch (error) {
                    console.error("JSON parsing error:", error);
                    reject(new Error("Failed to parse response"));
                }
            });
        });

        request.on("error", (error) => {
            console.error("Request error:", error);
            reject(error);
        });

        request.end();
    });
};
export { ChannelResponse };

