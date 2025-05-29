import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { User } from './model/user'; // Importing User model
import DashboardView from './view/Dashboard-view';
import LoginView from './view/login-view';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made
    const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'department'>('login');
    const [user, setUser] = useState<User | null>(null); // Updated to hold the user object
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async (userName: string, password: string) => {
        try {
            const resp = await window.electronAPI.loginUser(
                `{ "userName": "${userName}", "password": "${password}" }`
            );

            if (resp.status) {
                setIsAuthenticated(true);
                setCurrentView('dashboard');
                setUser(resp.user); 
                setErrorMessage(null); // Clear any previous error messages
            } else {
                setLoginAttempted(true);
                setIsAuthenticated(false);
                setErrorMessage('Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.error("Backend connection failed:", error);
        
            setLoginAttempted(true);
            setIsAuthenticated(false);
            setErrorMessage('Unable to connect to the server. Please try again later.');
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
                    <DashboardView
                        user={user}
                        handleLogout={handleLogout}
                    /> // Pass the user object
            ) : (
                <LoginView
                    onLogin={handleLogin}
                    loginAttempted={loginAttempted}
                    errorMessage={errorMessage}
                />
            )}
        </>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
