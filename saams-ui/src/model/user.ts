import { Base } from "./base";
import Response from "./response";

export interface UserLogin {
    userName: string,
    password: string
}

export interface User extends Base {
    userNumber: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    sex: string;
    dateOfBirth: string; // yyyy-mm-dd
    dateOfJoining: string; // yyyy-mm-dd
    email: string;
    phone: string;
    reportsTo: number;
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
