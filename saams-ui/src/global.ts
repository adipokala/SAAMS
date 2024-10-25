import { Department, DepartmentResponse } from "./model/department";
import { Designation, DesignationResponse } from "./model/designation";
import { PrivilegeResponse, Privilege } from "./model/privilege";
import { Role, RoleResponse } from "./model/role";
import { ShiftResponse, Shift } from "./model/shift";
import { UserResponse, User } from "./model/user";

export {};

declare global {
    interface Window {
        electronAPI: {
            loginUser: (json: string) => UserResponse;
            // Department
            getDepartments: () => DepartmentResponse;
            createDepartment: (department: Department) => DepartmentResponse;
            updateDepartment: (department: Department) => DepartmentResponse;
            deleteDepartment: (id: number) => DepartmentResponse;
            // Designation
            getDesignations: () => DesignationResponse;
            createDesignation: (designation: Designation) => DesignationResponse;
            updateDesignation: (designation: Designation) => DesignationResponse;
            deleteDesignation: (id: number) => DesignationResponse;
            //Privilege
            getPrivileges: () => PrivilegeResponse;
            createPrivilege: (role: Privilege) => PrivilegeResponse;
            updatePrivilege: (role: Privilege) => PrivilegeResponse;
            deletePrivilege: (id: number) => PrivilegeResponse;
            // Role
            getRoles: () => RoleResponse;
            createRole: (role: Role) => RoleResponse;
            updateRole: (role: Role) => RoleResponse;
            deleteRole: (id: number) => RoleResponse;
            // Shift
            getShifts: () => ShiftResponse;
            createShift: (shift: Shift) => ShiftResponse;
            updateShift: (shift: Shift) => ShiftResponse;
            deleteShift: (id: number) => ShiftResponse;
            // User
            getUsers: () => UserResponse;
            createUser: (user: User) => UserResponse;
            updateUser: (user: User) => UserResponse;
            deleteUser: (id: number) => UserResponse;
        }
    }
}