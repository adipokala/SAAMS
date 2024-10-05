import { Base } from "./base";
import Response from "./response";

export interface Role extends Base {
    name: string;
    code: string;
}

export interface RoleResponse extends Response {
    role: Role;
    roles: Role[];
}
