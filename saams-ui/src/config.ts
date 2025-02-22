import { Password } from "@mui/icons-material"

export const API_CONFIG = {
    hostname: 'localhost',
    port: 7192,
    headers: {
        'Content-Type': 'application/json'
    },
}

export const API_ENDPOINTS = {
    login: '/api/auth/login',
    password: '/api/auth/password',
    company: '/api/company',
    department: '/api/department',
    designation: '/api/designation',
    privilege: '/api/privilege',
    role: '/api/role',
    roleprivilege: '/api/roleprivilege',
    shift: '/api/shift',
    user: '/api/user',
    area: '/api/area',
    channel: '/api/channel',
}