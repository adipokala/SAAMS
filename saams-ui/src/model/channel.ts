import { Base } from "./base";
import Response from "./response";

// channel.ts
export interface Channel {
    id: number;
    name: string;
    code: string;
    type: 'tcpip' | 'serial';
    value: number;
    LTS: boolean;
    created_at: string;
    updated_at: string;
    ipAddress?: string;
    port?: number;
    comPort?: string;
    baudRate?: number;
}

export interface ChannelResponse {
    channels: Channel[]; // List of channels (for fetching multiple)
    channel: Channel;    // Single channel (for fetching one)
    message?: string;    // Optional success/error message
    status?: boolean;    // API response status
}
