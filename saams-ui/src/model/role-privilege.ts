import { Base } from "./base";
import Response from "./response";

export interface RolePrivilege extends Base {
    roleId: number;
    privilegeId: number;
}

export interface RolePrivilegeResponse extends Response {
    rolePrivilege: RolePrivilege;
    rolePrivileges: RolePrivilege[];
}
