import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginView from './view/login-view';
import DashboardView from './view/Dashboard-view';
import DepartmentView from './view/Department-view';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made
    const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'department'>('login');

    const handleLogin = async (userName: string, password: string) => {
        const resp = await window.electronAPI.loginUser('{ "userName": "' + userName + '", "password": "' + password + '" }');
        if(resp.status) {
            setIsAuthenticated(true);
            setCurrentView('dashboard');
        } else {
            setLoginAttempted(true);
            setIsAuthenticated(false);
        }
    };

    const handleSwitchView = () => {
        setCurrentView('department')
    }

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentView('login');
    }
    return (
        <>
        {isAuthenticated && (
            <Box
                sx={{
                position: 'fixed',
                top: 10,
                right: 10,
                zIndex: 1000, // Ensure the button stays on top of other elements
                }}
            >
                <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
                </Button>
            </Box>
            )}
        {isAuthenticated ? (
            currentView == 'dashboard' ? (<DashboardView onSwitchView={handleSwitchView}/>
            ) : (
                currentView == 'department' && (<DepartmentView />)
            )
        ) : (
            <LoginView onLogin={handleLogin} loginAttempted={loginAttempted} />
        )}
        </>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
