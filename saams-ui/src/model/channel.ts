export interface Channel {
    id: number;
    name: string;
    code: string;
    type: 'TCPIP' | 'SERIAL';
    value: string; // Format: "port:ipAddress" for TCPIP, "comPort:baudRate" for SERIAL
    LTS: boolean;
}

export interface ChannelResponse {
    channel: Channel | null;
    channels: Channel[];
    message: string;
    status: boolean;
}