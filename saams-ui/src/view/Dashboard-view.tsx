import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";
import { User } from '../model/user'; // Importing User model
import AccountDetailsView from "./account-details-view"; // Ensure correct import path
import AreaView from './area-view';
import CompanyView from './company-view';
import DepartmentView from "./Department-view"; // Ensure correct import path
import DesignationView from "./designation-view"; // Ensure correct import path
import HomeView from "./home-view"; // Ensure correct import path
import RoleView from "./role-view"; // Ensure correct import path
import ShiftView from "./shift-view"; // Ensure correct import path
import UserReportView from './user-report-view';
import UserView from "./user-view"; // Ensure correct import path

interface DashboardViewProps {
  handleLogout: () => void;
  user: User; // Updated to pass the whole user object
}

const drawerWidth = 240;

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

const userManagementItems: string[] = ['Home', 'Company', 'Designation', 'Department', 'Role', 'Shift', 'User', 'Change Password'];

const accessManagementItems: string[] = ['Area', 'Channel', 'Reader'];
const reportManagementItems: string[] = ['User Report', 'Reader Report', 'Attendance Report'];

const switchView = (key: string, user: User): React.JSX.Element => {
    if (key === 'Change Password') {
        return <AccountDetailsView user={user} />; // Assuming this view handles password change
    }

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
    case 'Account Details': 
      return <AccountDetailsView user={user} />; // Pass the whole user object
      
    case 'Company':
      return <CompanyView />;
    
    case 'User Report':
      return <UserReportView />
    case 'Area':
      return <AreaView />;

    default:
      return <HomeView />;
  }
};

export default function DashboardView({ user, handleLogout }: DashboardViewProps) {
  const [item, setItem] = React.useState<string>('Home');
  const [open, setOpen] = React.useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const toggleMenuOpen = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountDetails = () => {
    setItem("Account Details");
    handleMenuClose();
  };
  
  const userManagementList = (
    <List>
      {userManagementItems.map((text, index) => (
        <ListItemButton key={index}>
          <ListItemText
            primary={text}
            sx={{ color: darkTheme.palette.text.primary }}
            onClick={() => setItem(userManagementItems[index])}
          />
        </ListItemButton>
      ))}
    </List>
  );

  const accessManagementList = (
    <List>
      {accessManagementItems.map((text, index) => (
        <ListItemButton key={index}>
          <ListItemText
            primary={text}
            sx={{ color: darkTheme.palette.text.primary }}
            onClick={() => setItem(accessManagementItems[index])}
          />
        </ListItemButton>
      ))}
    </List>
  );

  const reportManagementList = (
    <List>
      {reportManagementItems.map((text, index) => (
        <ListItemButton key={index}>
          <ListItemText
            primary={text}
            sx={{ color: darkTheme.palette.text.primary }}
            onClick={() => setItem(reportManagementItems[index])}
          />
        </ListItemButton>
      ))}
    </List>
  );

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
            Welcome to {user.firstName}
          </Typography>

          {/* Profile Icon and Dropdown */}
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            size="large"
          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
<MenuItem onClick={handleAccountDetails}>Account Details</MenuItem>
<MenuItem onClick={() => setItem("Change Password")}>Change Password</MenuItem>

            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            display: open ? "block" : "none",  
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
          {switchView(item, user)} {/* Pass the whole user object */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
