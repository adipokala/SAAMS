import Response from "./response";

export interface Department {
    id: number;
    name: string;
    code: string;
}

export interface DepartmentResponse extends Response {
    department: Department;
    departments: Department[];
}
