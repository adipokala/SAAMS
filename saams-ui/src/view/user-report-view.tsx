import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Refresh } from '@mui/icons-material';
import { Card, CardContent, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import { User } from '../model/user';
import { STRINGS } from '../constants';


export default function UserReportView() {
  const [roleName, setRoleName] = React.useState<string>('');
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorDialog, setErrorDialog] = React.useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: '',
    message: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.getUsers();
      if (!response.status) {
        throw new Error('Failed to fetch user data');
      }
      setUsers(response.users);
    } catch (error) {
      setErrorDialog({ open: true, title: 'Error', message: error.message || 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = async (id: number) => {
    const resp = await window.electronAPI.getRole(id);
    setRoleName(resp.role.name);
  }

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text('User Report', 20, 10);
    users.forEach((user, index) => {
      const userText = `
        User ${index + 1}:
        ID: ${user.id}
        First Name: ${user.firstName}
        Last Name: ${user.lastName}
        Username: ${user.userName}
        Email: ${user.email}
        Phone: ${user.phone}
        Role name : ${roleName}
        Company id: ${user.companyId}
        Designation id: ${user.designationId}
        Department id: ${user.departmentId}
        Shift id: ${user.shiftId}
        Date of Birth: ${user.dateOfBirth}
        Date of Joining: ${user.dateOfJoining}
      `;
      doc.text(userText, 10, 20 + index * 60);
    });
    doc.save('user-report.pdf');
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={fetchUsers} startIcon={<Refresh />} disabled={loading}>
          Refresh
        </Button>
        <Button variant="contained" onClick={handleExportToPDF} disabled={!users.length}>
          Export to PDF
        </Button>
      </Stack>

      {loading && <Typography>Loading...</Typography>}

      <Stack spacing={2}>
        {users.map((user, index) => (
          <Card key={user.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">User {index + 1}</Typography>
              <Typography>ID: {user.id}</Typography>
              <Typography>First Name: {user.firstName}</Typography>
              <Typography>Last Name: {user.lastName}</Typography>
              <Typography>Username: {user.userName}</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Phone: {user.phone}</Typography>
              <Typography>Role name: {roleName}</Typography>
              <Typography>Company Id: {user.companyId}</Typography>
              <Typography>Designation Id: {user.designationId}</Typography>
              <Typography>Department Id: {user.departmentId}</Typography>
              <Typography>Shift Id: {user.shiftId}</Typography>
              <Typography>Date of Birth: {user.dateOfBirth}</Typography>
              <Typography>Date of Joining: {user.dateOfJoining}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

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
          <Button onClick={() => setErrorDialog((prev) => ({ ...prev, open: false }))}>{STRINGS.ok || 'OK'}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
