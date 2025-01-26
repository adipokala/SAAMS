import { Base } from "./base";
import Response from "./response";

export interface Area extends Base {
    name: string;
    code: string;
}

export interface AreaResponse extends Response {
    areas: Area[];
    area: Area;

}