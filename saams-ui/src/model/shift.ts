import { Base } from "./base";
import Response from "./response"

export interface Shift extends Base {
    description: number;
    type: string;
    entryTime: string; // D.HH:mm:ss
    entryGrace: number; // D.HH:mm:ss
    exitLunch: string; // D.HH:mm:ss
    entryLunch: string; // D.HH:mm:ss
    exitTime: string; // D.HH:mm:ss
    exitGrace: number; // D.HH:mm:ss
    overTimeAllowance: number; // D.HH:mm:ss
}

export interface ShiftResponse extends Response {
    shift: Shift;
    shifts: Shift[];
}