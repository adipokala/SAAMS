import React from "react";
import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography, Grid, Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const drawerWidth = 240;

// Create a custom dark theme that mimics Discord's color palette
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#36393f", // Discord's dark background color
      paper: "#2f3136",   // Sidebar and panels
    },
    primary: {
      main: "#7289da",    // Discord's primary blue color
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#b9bbbe", // Grayish text for secondary information
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default function DiscordLikeInterface() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: darkTheme.palette.background.paper, // Dark sidebar color
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Server 1", "Server 2", "Server 3", "Server 4"].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemText primary={text} sx={{ color: darkTheme.palette.text.primary }} />
                </ListItem>
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
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#2f3136" }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ color: darkTheme.palette.text.primary }}>
                Dashboard
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Content below AppBar */}
          <Toolbar />
          <Grid container spacing={2}>
            {/* Chat area */}
            <Grid item xs={12}>
              <Typography paragraph sx={{ color: darkTheme.palette.text.secondary }}>
                This is a placeholder for the chat content. You can add your messages or other chat components here.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
