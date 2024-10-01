import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginView from './view/login-view';
import DashboardView from './view/Dashboard-view';
import { useState } from 'react';
import {net} from 'electron';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempted, setLoginAttempted] = useState(false); // Track if a login attempt has been made

    const handleLogin = (userName: string, password: string) => {
        console.log('EnteredhandleLogin');
        window.electronAPI.loginUser('{userName: ' + userName + ', password: '+ password + '}');
        if(userName == 'admin' && password == '123') {
            setIsAuthenticated(true);
        } else {
            setLoginAttempted(true);
            setIsAuthenticated(false);
        }
    };

    const handleOnGet = async () => {
        console.log('entered the handle get request');
        const id = await window.electronAPI.onGetIPC();
        console.log('came back !!')
        console.log(id);

        return id;
    }
    return (
        <>
        {isAuthenticated ? (
            <DashboardView onGet={handleOnGet}/> // Show the dashboard if authenticated
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
