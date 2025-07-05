import { Base } from "./base";
import Response from "./response";

export interface LeaveCounter extends Base {
    counter: number;
    expiry: string; // D.HH:mm:ss
    userId: number;
    leaveId: number;
}

export interface LeaveCounterResponse extends Response {
    leaveCounters: LeaveCounter[];
    leaveCounter: LeaveCounter;
}