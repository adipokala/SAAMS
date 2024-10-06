import React from "react";
import {
  AppBar,
  Drawer,
  List,
  ListItemText,
  Toolbar,
  Typography,
  Grid,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { Department, DepartmentResponse } from "../model/department";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface DashboardViewProps {
  userNameForDashboard: string;
}

const handleOnGet = async () => {
  const id = await window.electronAPI.getDepartments();
  console.log(id);

  return id;
};

const drawerWidth = 240;

// Create a custom dark theme that mimics Discord's color palette
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#36393f",
      paper: "#2f3136",
    },
    primary: {
      main: "#7289da", 
    },
    text: {
      primary: "#ffffff", 
      secondary: "#b9bbbe",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default function DashboardView({ userNameForDashboard }: DashboardViewProps) {
  const [rows, setRows] = React.useState<Department[]>([]);
  

  const handleButtonClick = async (event: React.MouseEvent) => {
    const response = await handleOnGet();
    console.log(response);
    const input = response.departments;
    const updatedRows = [
      ...rows,
      ...input.filter(
        (newEntry) =>
          !rows.some((existingEntry) => existingEntry.id === newEntry.id)
      ),
    ];

    setRows(updatedRows);
    
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: darkTheme.palette.background.paper,
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Department"].map((text, index) => (
                <ListItemButton>
                  <ListItemText
                    primary={text}
                    sx={{ color: darkTheme.palette.text.primary }}
                    onClick={handleButtonClick}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: darkTheme.palette.background.default,
            p: 3,
            ml: `${drawerWidth}px`,
            height: "100vh",
          }}
        >
          {/* Top bar */}
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "#2f3136",
            }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: darkTheme.palette.text.primary }}
              >
                Welcome to {userNameForDashboard}
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Content below AppBar */}
          <Toolbar />
          <Grid container spacing={2} direction="column">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Code</TableCell>
                    <TableCell align="right">Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.code}</TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
