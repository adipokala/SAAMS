import { Base } from './base';
import Response from './response';

export interface Channel extends Base {
    name: string;
    code: string;
    type: 'TCPIP' | 'SERIAL';
    value: string; // Format: "port:ipAddress" for TCPIP, "comPort:baudRate" for SERIAL
    LTS: boolean;
}

export interface ChannelResponse extends Response {
    channel: Channel | null;
    channels: Channel[];
}