import { Base } from "./base";
import Response from "./response";

export interface Privilege extends Base {
    name: string;
    code: string;
}

export interface PrivilegeResponse extends Response {
    privilege: Privilege;
    privileges: Privilege[];
}
