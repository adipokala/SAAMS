import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardView from './view/Dashboard-view';
import LoginView from './view/login-view';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    phone: string;
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made
    const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'department'>('login');
    const [user, setUser] = useState<User | null>(null); // Updated to hold the user object

    const handleLogin = async (userName: string, password: string) => {
        const resp = await window.electronAPI.loginUser(`{ "userName": "${userName}", "password": "${password}" }`);
        console.log(resp); // Log the response to inspect its structure
        if (resp.status) {
            setIsAuthenticated(true);
            setCurrentView('dashboard');
            setUser(resp.user); 
            
            console.log(`Logged in as: ${resp.user.firstName} ${resp.user.lastName}`);
        } else {
            setLoginAttempted(true);
            setIsAuthenticated(false);
        }
    };
    

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentView('login');
        setUser(null); // Clear the user object
    }
    return (
        <>
        {isAuthenticated ? (
            currentView === 'dashboard' ? (
                <DashboardView user={user} handleLogout={handleLogout} /> // Pass the user object
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
