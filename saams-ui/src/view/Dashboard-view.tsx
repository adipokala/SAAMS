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
import DepartmentView from "./Department-view";

interface DashboardViewProps {
  userNameForDashboard: string;
}

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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
                    // onClick={handleButtonClick}
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
        
          {/* Content below AppBar */}
          <Toolbar />
          <DepartmentView />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
