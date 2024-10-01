import React from 'react';
import Button from '@mui/material/Button';

interface DashboardViewProps {
  onSwitchView: () => void;
}

export default function DashboardView({ onSwitchView }: DashboardViewProps) {
  return (
    <div>
      <h1>Dashboard View</h1>
      <Button variant="contained" onClick={onSwitchView}>Department</Button>
    </div>
  );
}