"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const login_view_1 = __importDefault(require("./view/login-view"));
const Dashboard_view_1 = __importDefault(require("./view/Dashboard-view"));
const react_2 = require("react");
function App() {
    const [isAuthenticated, setIsAuthenticated] = (0, react_2.useState)(false);
    const handleLogin = (userName, password) => {
        if (userName == 'admin' && password == '123') {
            setIsAuthenticated(true);
        }
        else {
            alert('Invaliid username or password');
            setIsAuthenticated(false);
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null, isAuthenticated ? (react_1.default.createElement(Dashboard_view_1.default, null) // Show the dashboard if authenticated
    ) : (react_1.default.createElement(login_view_1.default, { onLogin: handleLogin }))));
}
const root = (0, client_1.createRoot)(document.body);
root.render(react_1.default.createElement(App, null));
//# sourceMappingURL=app.js.map