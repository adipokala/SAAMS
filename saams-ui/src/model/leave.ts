import { Base } from "./base";
import Response from "./response";

export interface Leave extends Base {
    name: string;
    code: string;
    description: string;
    count: number;
    autoRenew: boolean;
    validity: string;
    renewalDate: string;
}

export interface LeaveResponse extends Response {
    leaves: Leave[];
    leave: Leave;
}
