import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";
import { User } from '../model/user'; // Importing User model

interface AccountDetailsViewProps {
  user: User; // Using imported User model
}

const AccountDetailsView: React.FC<AccountDetailsViewProps> = ({ user }) => {
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountDetailsView;
