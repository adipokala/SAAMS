import { Base } from './base';
import Response from './response';

export interface SerialData extends Base{
    message: string;
  }
export interface SerialDataResponse extends Response{
  status: boolean;
  serialData: string;
}
