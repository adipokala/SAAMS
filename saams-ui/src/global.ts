import { Department } from "./model/department";
import { UserLoginResponse } from "./model/user";

export {};

declare global {
    interface Window {
        electronAPI: {
            loginUser: (json: string) => UserLoginResponse;
            getDepartments: () => Department[];
        }
    }
}