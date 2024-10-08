import { Department, DepartmentResponse } from "./model/department";
import { UserLoginResponse } from "./model/user";

export {};

declare global {
    interface Window {
        electronAPI: {
            loginUser: (json: string) => UserLoginResponse;
            getDepartments: () => DepartmentResponse;
            createDepartment: (department: Department) => DepartmentResponse;
            updateDepartment: (department: Department) => DepartmentResponse;
            deleteDepartment: (id: number) => DepartmentResponse;
        }
    }
}