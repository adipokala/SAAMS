import * as React from 'react';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem, Select, Typography, Card, CardContent } from '@mui/material';
import jsPDF from 'jspdf';
import { User } from '../model/user';
import { STRINGS } from '../constants';

export default function UserReportView() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [roleNames, setRoleNames] = useState<Record<number, string>>({});
  const [departmentNames, setDepartmentNames] = useState<Record<number, string>>({});
  const [companyNames, setCompanyNames] = useState<Record<number, string>>({});
  const [shiftNames, setShiftNames] = useState<Record<number, string>>({});
  const [designationNames, setDesignationNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: '',
    message: '',
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.getUsers();
      if (!response?.status) {
        throw new Error('Failed to fetch user data');
      }
      setUsers(response.users);
    } catch (error) {
      setErrorDialog({ open: true, title: 'Error', message: error.message || 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch role name for a given ID using IPC
  const fetchRoleName = async (roleId: number) => {
    try {
      const response = await window.electronAPI.getRole(roleId);
      return response?.role?.name || 'Unknown Role';
    } catch (error) {
      console.error(`Error fetching role name for ID ${roleId}:`, error);
      return 'Unknown Role';
    }
  };

  // Fetch department name for a given ID using IPC
  const fetchDepartmentName = async (departmentId: number) => {
    try {
      const response = await window.electronAPI.getDepartment(departmentId);
      return response?.department?.name || 'Unknown Department';
    } catch (error) {
      console.error(`Error fetching department name for ID ${departmentId}:`, error);
      return 'Unknown Department';
    }
  };

  // Fetch company name for a given ID using IPC
  const fetchCompanyName = async (companyId: number) => {
    try {
      const response = await window.electronAPI.getCompany(companyId); // Ensure this is exposed in the main process
      return response?.company?.name || 'Unknown Company';
    } catch (error) {
      console.error(`Error fetching company name for ID ${companyId}:`, error);
      return 'Unknown Company';
    }
  };

  const fetchShiftName = async (shiftId: number) => {
    try {
      const response = await window.electronAPI.getShift(shiftId);
      return response?.shift?.name || 'Unknown Shift';
    } catch (error) {
      console.error(`Error fetching shift name for ID ${shiftId}:`, error);
      return 'Unknown Shift';
    }
  }

  const fetchDesignationName = async (designationId: number) => {
    try {
      const response = await window.electronAPI.getDesignation(designationId);
      return response?.designation?.name || 'Unknown Designation';
    } catch (error) {
      console.error(`Error fetching designation name for ID ${designationId}:`, error);
      return 'Unknown Designation';
    }
  }

  // Load role names, department names, and company names for all users
  const loadRoleAndDepartmentNames = async () => {
    const roleMap: Record<number, string> = {};
    const departmentMap: Record<number, string> = {};
    const companyMap: Record<number, string> = {};
    const shiftMap: Record<number, string> = {};
    const designationMap: Record<number, string> = {};

    for (const user of users) {
      if (!roleMap[user.roleId]) {
        const roleName = await fetchRoleName(user.roleId);
        roleMap[user.roleId] = roleName;
      }
      if (!departmentMap[user.departmentId]) {
        const departmentName = await fetchDepartmentName(user.departmentId);
        departmentMap[user.departmentId] = departmentName;
      }
      if (!companyMap[user.companyId]) {
        const companyName = await fetchCompanyName(user.companyId);
        companyMap[user.companyId] = companyName;
      }
      if (!shiftMap[user.shiftId]) {
        const shiftName = await fetchShiftName(user.shiftId);
        shiftMap[user.shiftId] = shiftName;
      }
      if (!designationMap[user.designationId]) {
        const designationName = await fetchDesignationName(user.designationId);
        designationMap[user.designationId] = designationName;
      }
    }

    setRoleNames(roleMap);
    setDepartmentNames(departmentMap);
    setCompanyNames(companyMap);
    setShiftNames(shiftMap);
    setDesignationNames(designationMap);
  };

  // Export user to PDF
  const exportUserToPDF = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      alert('User not found!');
      return;
    }

    const roleName = roleNames[user.roleId] || (await fetchRoleName(user.roleId));
    const departmentName = departmentNames[user.departmentId] || (await fetchDepartmentName(user.departmentId));
    const companyName = companyNames[user.companyId] || (await fetchCompanyName(user.companyId));
    const shiftName = shiftNames[user.shiftId] || (await fetchShiftName(user.shiftId));
    const designationName = designationNames[user.designationId] || (await fetchDesignationName(user.designationId));

    const doc = new jsPDF();
    const userText = `
      User Report:
      ID: ${user.id}
      First Name: ${user.firstName}
      Last Name: ${user.lastName}
      Username: ${user.userName}
      Email: ${user.email}
      Phone: ${user.phone}
      Role Name: ${roleName}
      Department Name: ${departmentName}
      Company Name: ${companyName}
      Designation Name: ${designationName}
      Shift Name: ${shiftName}
      Date of Birth: ${user.dateOfBirth}
      Date of Joining: ${user.dateOfJoining}
    `;
    doc.text(userText, 10, 10);
    doc.save(`${user.firstName}-${user.lastName}-report.pdf`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      loadRoleAndDepartmentNames();
    }
  }, [users]);

  return (
    <Stack spacing={4} style={{ padding: '20px' }}>
      <Typography variant="h4">User Report Generator</Typography>

      {/* Dropdown to Select User */}
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography>Select a User:</Typography>
        <Select
          value={selectedUserId ?? undefined}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          displayEmpty
          style={{ minWidth: '200px' }}
        >
          <MenuItem value="" disabled>
            Select a user
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={fetchUsers} disabled={loading}>
          Refresh Users
        </Button>
      </Stack>

      {/* Display Selected User Information */}
      {selectedUserId && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">User Information</Typography>
            {(() => {
              const user = users.find((u) => u.id === selectedUserId);
              if (!user) return <Typography>User not found!</Typography>;
              const roleName = roleNames[user.roleId] || 'Loading...';
              const departmentName = departmentNames[user.departmentId] || 'Loading...';
              const companyName = companyNames[user.companyId] || 'Loading...';
              const shiftName = shiftNames[user.shiftId] || 'Loading...';
              const designationName = designationNames[user.designationId] || 'Loading...';
              return (
                <Stack spacing={1}>
                  <Typography>ID: {user.id}</Typography>
                  <Typography>First Name: {user.firstName}</Typography>
                  <Typography>Last Name: {user.lastName}</Typography>
                  <Typography>Username: {user.userName}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Phone: {user.phone}</Typography>
                  <Typography>Role Name: {roleName}</Typography>
                  <Typography>Department Name: {departmentName}</Typography>
                  <Typography>Company Name: {companyName}</Typography>
                  <Typography>Designation Name: {designationName}</Typography>
                  <Typography>Shift Name: {shiftName}</Typography>
                  <Typography>Date of Birth: {user.dateOfBirth}</Typography>
                  <Typography>Date of Joining: {user.dateOfJoining}</Typography>
                </Stack>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Export to PDF Button */}
      <Button
        variant="contained"
        onClick={() => selectedUserId && exportUserToPDF(selectedUserId)}
        disabled={!selectedUserId}
      >
        Export Selected User to PDF
      </Button>

      {/* Error Dialog */}
      <Dialog
        open={errorDialog.open}
        onClose={() => setErrorDialog((prev) => ({ ...prev, open: false }))}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">{errorDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">{errorDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog((prev) => ({ ...prev, open: false }))}>
            {STRINGS.ok || 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
