import { Base } from './base';
import Response from './response';

export interface Company extends Base {
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    email: string;
    phone: string;
    fax: string;
}

export interface CompanyResponse extends Response {
    company: Company;
    companies: Company[];
}
