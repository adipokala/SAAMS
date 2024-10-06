import { Base } from "./base";
import Response from "./response";

export interface Department extends Base {
    name: string;
    code: string;
}

export interface DepartmentResponse extends Response {
    department: Department;
    departments: Department[];
}
