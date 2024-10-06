import { Base } from "./base";
import Response from "./response";

export interface RolePrivilege extends Base {
    userRoleId: number;
    userPrivilegeId: number;
}

export interface RolePrivilegeResponse extends Response {
    rolePrivilege: RolePrivilege;
    rolePrivileges: RolePrivilege[];
}
