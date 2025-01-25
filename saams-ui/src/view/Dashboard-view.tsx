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
  Button,
  Divider,
  ListSubheader,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from "@mui/material/ListItemButton";
import DepartmentView from "./Department-view";
import DesignationView from "./designation-view";
import HomeView from "./home-view";
import { Logout } from "@mui/icons-material";
import ShiftView from "./shift-view";
import RoleView from "./role-view";
import UserView from "./user-view";
import CompanyView from "./company-view";
import AreaView from "./area-view";
import UserReportView from "./user-report-view";

interface DashboardViewProps {
  handleLogout: any;
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

const userManagementItems: string[] = ['Home', 'Company', 'Designation', 'Department', 'Role', 'Shift', 'User'];
const accessManagementItems: string[] = ['Area', 'Channel', 'Reader'];
const reportManagementItems: string[] = ['User Report', 'Reader Report', 'Attendance Report'];

const switchView = (key: string): React.JSX.Element => {
  console.log("Clicked on: " + key);

  switch (key) {
    case 'Home':
      return <HomeView />;

    case 'Designation':
      return <DesignationView />;

    case 'Department':
      return <DepartmentView />;

    case 'Shift':
      return <ShiftView />;

    case 'Role':
      return <RoleView />;

    case 'User':
      return <UserView />;

    case 'Company':
      return <CompanyView />;

    case 'User Report':
      return <UserReportView />
    case 'Area':
      return <AreaView />;

    default:
      return <HomeView />;
  }
}

export default function DashboardView({ userNameForDashboard, handleLogout }: DashboardViewProps) {
  const [item, setItem] = React.useState<string>('Home');
  const [open, setOpen] = React.useState<boolean>(true);

  const toggleMenuOpen = () => {
    setOpen(!open);
  }

  const userManagementList = <List>
    {userManagementItems.map((text, index) => (
      <ListItemButton>
        <ListItemText
          primary={text}
          sx={{ color: darkTheme.palette.text.primary }}
          onClick={() => setItem(userManagementItems[index])} />
      </ListItemButton>
    ))}
  </List>;

  const accessManagementList = <List>
    {accessManagementItems.map((text, index) => (
      <ListItemButton>
        <ListItemText
          primary={text}
          sx={{ color: darkTheme.palette.text.primary }}
          onClick={() => setItem(accessManagementItems[index])} />
      </ListItemButton>
    ))}
  </List>;

  const reportManagementList = <List>
    {reportManagementItems.map((text, index) => (
      <ListItemButton>
        <ListItemText
          primary={text}
          sx={{ color: darkTheme.palette.text.primary }}
          onClick={() => setItem(reportManagementItems[index])} />
      </ListItemButton>
    ))}
  </List>;

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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Welcome to {userNameForDashboard}
          </Typography>

          <Button color="inherit" onClick={handleLogout}>Logout <Logout /></Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            visibility: open ? "visible" : "collapse",
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
            <ListSubheader component="div" id="nested-list-subheader">
              User Management
            </ListSubheader>
            {userManagementList}
            <Divider />
            <ListSubheader component="div" id="nested-list-subheader">
              Access Management
            </ListSubheader>
            {accessManagementList}
            <Divider />
            <ListSubheader component="div" id="nested-list-subheader">
              Report Management
            </ListSubheader>
            {reportManagementList}
          </Box>
        </Drawer>
        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: darkTheme.palette.background.default,
            p: 3,
            ml: open ? `${drawerWidth}px` : 0,
            height: "100vh",
          }}
        >

          {/* Content below AppBar */}
          <Toolbar />
          {switchView(item)}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
