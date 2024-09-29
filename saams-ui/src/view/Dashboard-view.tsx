import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface ButtonProps {
  onGet: () => void;
}
export default function DashboardView({onGet}: ButtonProps) {
  const handleButtonClick = (event: React.MouseEvent) =>  {
    console.log('button clicked !');
    onGet();
  }
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={handleButtonClick}>get</Button>
    </Stack>
  );
}