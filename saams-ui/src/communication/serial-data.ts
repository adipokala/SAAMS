import { SerialPort, ReadlineParser } from 'serialport';
import { SerialDataResponse } from '../model/serial-response';

const PORT_PATH = 'COM3';
const BAUD_RATE = 9600;

let lastReceivedData = '';

/** 
 * Initialize the serial port once.
 * You could open/close it on demand if desired.
 */
const port = new SerialPort({
  path: PORT_PATH,
  baudRate: BAUD_RATE,
  autoOpen: false,
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

port.open((err) => {
  if (err) {
    console.error('Error opening port: ', err.message);
  } else {
    console.log(`Serial port ${PORT_PATH} opened at baudRate ${BAUD_RATE}`);
  }
});

parser.on('data', (data: string) => {
  console.log('Serial Received:', data);
  lastReceivedData = data;
});

/**
 * Return the most recent data stored.
 * This example returns a single string. Adjust to your needs.
 */
export const getSerialData = (): SerialDataResponse => {
  return {
    status: true,
    serialData: lastReceivedData,
  };
};
