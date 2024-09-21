"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Avatar_1 = __importDefault(require("@mui/material/Avatar"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const CssBaseline_1 = __importDefault(require("@mui/material/CssBaseline"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Link_1 = __importDefault(require("@mui/material/Link"));
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const LockOutlined_1 = __importDefault(require("@mui/icons-material/LockOutlined"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const styles_1 = require("@mui/material/styles");
const react_1 = require("react");
function Copyright(props) {
    return (React.createElement(Typography_1.default, Object.assign({ variant: "body2", color: "text.secondary", align: "center" }, props),
        'Copyright © ',
        React.createElement(Link_1.default, { color: "inherit", href: "#" }, "Aurum Smart Tech"),
        ' ',
        new Date().getFullYear(),
        '.'));
}
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = (0, styles_1.createTheme)();
function LoginView({ onLogin }) {
    const [userName, setUserName] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    // Reset the input fields when the component is mounted or re-rendered
    React.useEffect(() => {
        setUserName('');
        setPassword('');
    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('userName'),
            password: data.get('password'),
        });
        // call the onLogin function passed as a prop
        onLogin(userName, password);
        //reset the input fields after login process
        setUserName('');
        setPassword('');
    };
    return (React.createElement(styles_1.ThemeProvider, { theme: defaultTheme },
        React.createElement(Grid_1.default, { container: true, component: "main", sx: { height: '100vh' } },
            React.createElement(CssBaseline_1.default, null),
            React.createElement(Grid_1.default, { item: true, xs: false, sm: 4, md: 7, sx: {
                    backgroundImage: 'url("/static/images/templates/templates-images/sign-in-side-bg.png")',
                    backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'left',
                } }),
            React.createElement(Grid_1.default, { item: true, xs: 12, sm: 8, md: 5, component: Paper_1.default, elevation: 6, square: true },
                React.createElement(Box_1.default, { sx: {
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    } },
                    React.createElement(Avatar_1.default, { sx: { m: 1, bgcolor: 'secondary.main' } },
                        React.createElement(LockOutlined_1.default, null)),
                    React.createElement(Typography_1.default, { component: "h1", variant: "h5" }, "Sign in"),
                    React.createElement(Box_1.default, { component: "form", noValidate: true, onSubmit: handleSubmit, sx: { mt: 1 } },
                        React.createElement(TextField_1.default, { margin: "normal", required: true, fullWidth: true, id: "userName", label: "User Name", name: "userName", value: userName, onChange: (e) => setUserName(e.target.value), autoFocus: true }),
                        React.createElement(TextField_1.default, { margin: "normal", required: true, fullWidth: true, name: "password", label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), id: "password" }),
                        React.createElement(Button_1.default, { type: "submit", fullWidth: true, variant: "contained", sx: { mt: 3, mb: 2 } }, "Sign In"),
                        React.createElement(Copyright, { sx: { mt: 5 } })))))));
}
exports.default = LoginView;
//# sourceMappingURL=login-view.js.map