import { Box, Button, Card, CardContent, Divider, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { User } from '../model/user'; // Importing User model

interface AccountDetailsViewProps {
  user: User; // Using imported User model
}

const AccountDetailsView: React.FC<AccountDetailsViewProps> = ({ user }) => {
  const [roleName, setRoleName] = useState<string>('');
  const [departmentName, setDepartmentName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [shiftName, setShiftName] = useState<string>('');
  const [designationName, setDesignationName] = useState<string>('');
  
  // State for change password feature
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch role name
  const fetchRoleName = async (roleId: number) => {
    const response = await window.electronAPI.getRole(roleId);
    return response?.role?.name || 'Unknown Role';
  };

  // Fetch department name
  const fetchDepartmentName = async (departmentId: number) => {
    const response = await window.electronAPI.getDepartment(departmentId);
    return response?.department?.name || 'Unknown Department';
  };

  // Fetch company name
  const fetchCompanyName = async (companyId: number) => {
    const response = await window.electronAPI.getCompany(companyId);
    return response?.company?.name || 'Unknown Company';
  };

  // Fetch shift name
  const fetchShiftName = async (shiftId: number) => {
    const response = await window.electronAPI.getShift(shiftId);
    return response?.shift?.name || 'Unknown Shift';
  };

  // Fetch designation name
  const fetchDesignationName = async (designationId: number) => {
    const response = await window.electronAPI.getDesignation(designationId);
    return response?.designation?.name || 'Unknown Designation';
  };

  useEffect(() => {
    const loadAdditionalDetails = async () => {
      if (user) {
        const role = await fetchRoleName(user.roleId);
        const department = await fetchDepartmentName(user.departmentId);
        const company = await fetchCompanyName(user.companyId);
        const shift = await fetchShiftName(user.shiftId);
        const designation = await fetchDesignationName(user.designationId);

        setRoleName(role);
        setDepartmentName(department);
        setCompanyName(company);
        setShiftName(shift);
        setDesignationName(designation);
      }
    };

    loadAdditionalDetails();
  }, [user]);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        setMessage({ text: "All fields are required.", type: "error" });
        return;
    }

    if (newPassword !== confirmPassword) {
        setMessage({ text: "New passwords do not match.", type: "error" });
        return;
    }

    try {
        const response = await window.electronAPI.changePassword(user.userName, currentPassword, newPassword);
        if (response?.success) {
            setMessage({ text: "Password changed successfully.", type: "success" });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ text: response?.error || "Failed to change password.", type: "error" });
        }
    } catch (error) {
        setMessage({ text: "An error occurred. Please try again.", type: "error" });
    }
};

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Account Details
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>First Name:</strong> {user.firstName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Last Name:</strong> {user.lastName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Username:</strong> {user.userName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Phone No:</strong> {user.phone}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Role Name:</strong> {roleName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Department Name:</strong> {departmentName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Company Name:</strong> {companyName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Shift Name:</strong> {shiftName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Designation Name:</strong> {designationName}
          </Typography>
          <Divider sx={{ margin: '20px 0' }} />
          <Typography variant="h6">Change Password</Typography>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleChangePassword}>
            Change Password
          </Button>
          {message && (
            <Typography sx={{ marginTop: 2, color: message.type === "success" ? "green" : "red" }}>
              {message.text}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default AccountDetailsView;
