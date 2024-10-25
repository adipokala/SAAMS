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

const menuItems: string[] = [ 'Home', 'Designation', 'Department', 'Role', 'Shift', 'User' ]

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
            <List>
              { menuItems.map((text, index) => (
                <ListItemButton>
                  <ListItemText
                    primary={text}
                    sx={{ color: darkTheme.palette.text.primary }}
                    onClick={() => setItem(menuItems[index])}
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
          { switchView(item) }
        </Box>
      </Box>
    </ThemeProvider>
  );
}
