import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";

interface AccountDetailsViewProps {
  firstName: string;
  lastName: string;
  email: string;
}

const AccountDetailsView: React.FC<AccountDetailsViewProps> = ({ firstName, lastName, email }) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Account Details
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>First Name:</strong> {firstName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Last Name:</strong> {lastName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Email:</strong> {email}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountDetailsView;
