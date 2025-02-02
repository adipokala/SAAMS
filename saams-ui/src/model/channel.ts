import { Base } from "./base";
import Response from "./response";

export interface Channel extends Base {
    name: string; // Name of the channel
    type: string; // Type of the channel (e.g., "email", "sms", etc.)
    value: string; // Value associated with the channel (e.g., email address, phone number)
    LTS: boolean; // Long-Term Support flag (true/false)
    created_at: string; // Timestamp when the channel was created
    updated_at: string; // Timestamp when the channel was last updated
}

export interface ChannelResponse extends Response {
    channels: Channel[]; // List of channels (for responses that return multiple channels)
    channel: Channel; // Single channel (for responses that return a single channel)
}