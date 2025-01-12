import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import React from "react";

interface AccountDetailsViewProps {
  userName: string;
  email: string;
}

const AccountDetailsView: React.FC<AccountDetailsViewProps> = ({ userName, email }) => {
  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Account Details
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>Username:</strong> {userName}
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
