import * as React from 'react';
import { Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Refresh } from '@mui/icons-material';
import { SerialDataResponse } from '../model/serial-response'; // or define your own shape


// Chatgpt generated for testing purpose
export default function SerialView() {
  const [serialData, setSerialData] = React.useState<string>('');

  const handleGetSerialData = async () => {
    // Call the new API function
    const response: SerialDataResponse = await window.electronAPI.getSerialData();
    if (response.status) {
      setSerialData(response.serialData);
    } else {
      // handle error
      setSerialData('Error fetching serial data');
    }
  };

  React.useEffect(() => {
    handleGetSerialData();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Button variant="contained" onClick={handleGetSerialData}>
        Refresh <Refresh />
      </Button>
      <div style={{ marginTop: '1rem' }}>
        <h3>Most Recent Serial Data:</h3>
        <pre>{serialData}</pre>
      </div>
    </div>
  );
}
