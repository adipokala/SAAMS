import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginView from './view/login-view';
import DashboardView from './view/Dashboard-view';
import { useState } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made

    const handleLogin = (userName: string, password: string) => {
        if(userName == 'admin' && password == '123') {
            setIsAuthenticated(true);
        } else {
            setLoginAttempted(true);
            setIsAuthenticated(false);
        }
    };
    return (
        <>
        {isAuthenticated ? (
            <DashboardView /> // Show the dashboard if authenticated
        ) : (
            <LoginView onLogin={handleLogin} loginAttempted={loginAttempted} />
        )}
        </>
    );
}
const root = createRoot(document.body);
root.render(<App />);
