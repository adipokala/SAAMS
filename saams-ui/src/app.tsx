import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginView from './view/login-view';
import DashboardView from './view/Dashboard-view';
import DepartmentView from './view/Department-view';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import DiscordLikeInterface from './view/DiscordLikeView';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made
    const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'department'>('login');
    const [userNameForDashboard, setUserNameForDashboard] = useState<string>('');

    const handleLogin = async (userName: string, password: string) => {
        const resp = await window.electronAPI.loginUser('{ "userName": "' + userName + '", "password": "' + password + '" }');
        if(resp.status) {
            setIsAuthenticated(true);
            setCurrentView('dashboard');
            setUserNameForDashboard(resp.user.firstName);
            console.log(userNameForDashboard);
        } else {
            setLoginAttempted(true);
            setIsAuthenticated(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentView('login');
        setUserNameForDashboard('');
    }
    return (
        <>
        {isAuthenticated ? (
            currentView == 'dashboard' ? (<DashboardView userNameForDashboard={userNameForDashboard} handleLogout={handleLogout} />
            ) : (
                1
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
