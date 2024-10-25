import { Base } from "./base";
import Response from "./response";

export interface UserLogin {
    userName: string,
    password: string
}

export interface User extends Base {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    sex: string;
    email: string;
    phone: string;
    roleId: number;
    companyId: number;
    designationId: number;
    departmentId: number;
    shiftId: number;
}

export interface UserResponse extends Response {
    user: User;
    users: User[];
}
