import { Base } from "./base";
import Response from "./response";

// channel.ts
export interface Channel {
    id: number;          // Unique ID
    name: string;        // Channel Name
    description: string; // Channel Description
    code: string;        // Unique Code
    type: string;        // Channel Type (TCPIP/Serial)
    value: string;       // Value (IP:Port for TCPIP, COM Port for Serial)
    LTS: boolean;        // Long-Term Support flag
    created_at: string;  // Timestamp when created
    updated_at: string;  // Timestamp when updated
}

export interface ChannelResponse {
    channels: Channel[]; // List of channels (for fetching multiple)
    channel: Channel;    // Single channel (for fetching one)
    message?: string;    // Optional success/error message
    status?: boolean;    // API response status
}
