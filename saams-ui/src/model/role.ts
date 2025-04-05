import { Base } from "./base";
import { Privilege } from "./privilege";
import Response from "./response";

export interface Role extends Base {
    name: string;
    code: string;
    privileges?: Privilege;
}

export interface RoleResponse extends Response {
    role: Role;
    roles: Role[];
}
