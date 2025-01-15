import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardView from './view/Dashboard-view';
import LoginView from './view/login-view';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made
    const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'department'>('login');
    const [userNameForDashboard, setUserNameForDashboard] = useState<string>('');

    const handleLogin = async (userName: string, password: string) => {
        const resp = await window.electronAPI.loginUser(`{ "userName": "${userName}", "password": "${password}" }`);
        if (resp.status) {
            setIsAuthenticated(true);
            setCurrentView('dashboard');
            
            setUserNameForDashboard(`${resp.user.firstName} ${resp.user.lastName}`);
            
            console.log(`Logged in as: ${resp.user.firstName} ${resp.user.lastName}`);
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
