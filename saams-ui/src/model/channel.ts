export interface Channel {
    id: number;
    name: string;
    code: string;
    type: 'TCPIP' | 'SERIAL';
    value: string;
    LTS: boolean;
    created_at: string;
    updated_at: string;
    ipAddress?: string;
    port?: number;
    comPort?: string;
    baudRate?: number;
}

export interface ChannelResponse {
    channel: Channel | null;
    channels: Channel[];
    message: string;
    status: boolean;
}