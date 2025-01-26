import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountDetailsView;
