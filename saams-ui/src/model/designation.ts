import { Base } from "./base";
import Response from "./response";

export interface Designation extends Base {
    name: string;
    code: string;
}

export interface DesignationResponse extends Response {
    designation: Designation;
    designations: Designation[];
}