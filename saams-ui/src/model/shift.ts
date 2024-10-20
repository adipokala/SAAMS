import { Base } from "./base";
import Response from "./response"

export interface Shift extends Base {
    name: string;
    code: string;
    type: string;
    entryTime: string; // D.HH:mm:ss
    graceEntryTime: string; // D.HH:mm:ss
    exitLunch: string; // D.HH:mm:ss
    entryLunch: string; // D.HH:mm:ss
    exitTime: string; // D.HH:mm:ss
    graceExitTime: string; // D.HH:mm:ss
    overTimeAllowance: string; // D.HH:mm:ss
}

export interface ShiftResponse extends Response {
    shift: Shift;
    shifts: Shift[];
}

export const ShiftType = {
    rotational: "ROTATIONAL",
    nonrotational: "NON_ROTATIONAL"
}