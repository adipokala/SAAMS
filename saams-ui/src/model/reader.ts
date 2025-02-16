import { Base } from './base';
import Response from './response';

export interface Reader extends Base {
    name: string;

    code: string;

    serialNumber: string;

    installationDate: string;

    isAttendanceReader: boolean;

    status: boolean;

    adminPIN: string;

    dateValidation: boolean;

    antiPassback: boolean;

    biometrics: boolean;

    sidControl: boolean;

    doorMode: string;

    type: string;

    accessControl: string;

    switch: string;

    display: string;

    unlockDuration: string;

    doorOpenDuration: string;

    displayDuration: string;

    transactionLog: string;

    channelId: number;

    areaId: number;

}

export interface ReaderResponse extends Response {
    reader: Reader;
    readers: Reader[];
}
