// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Department } from "./model/department";
import { Designation } from "./model/designation";
import { Privilege } from "./model/privilege";
import { Role } from "./model/role";
import { Shift } from "./model/shift";
import { User } from "./model/user";
import { Company } from "./model/company";
import { getShift } from "./api-request/shift";
import { getRole } from "./api-request/role";
import { getDesignation } from "./api-request/designation";
import { getDepartment } from "./api-request/department";

contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (json: string) => ipcRenderer.invoke('request:loginUser', json),
    // Department
    getDepartments: () => ipcRenderer.invoke('request:getDepartments'),
    getDepartment: (id: number) => ipcRenderer.invoke('request:getDepartment', id),
    createDepartment: (department: Department) => ipcRenderer.invoke('request:createDepartment', department),
    updateDepartment: (department: Department) => ipcRenderer.invoke('request:updateDepartment', department),
    deleteDepartment: (id: number) => ipcRenderer.invoke('request:deleteDepartment', id),
    // Designation
    getDesignations: () => ipcRenderer.invoke('request:getDesignations'),
    getDesignation: (id: number) => ipcRenderer.invoke('request:getDesignation', id),
    createDesignation: (designation: Designation) => ipcRenderer.invoke('request:createDesignation', designation),
    updateDesignation: (designation: Designation) => ipcRenderer.invoke('request:updateDesignation', designation),
    deleteDesignation: (id: number) => ipcRenderer.invoke('request:deleteDesignation', id),
    // Privilege
    getPrivileges: () => ipcRenderer.invoke('request:getPrivileges'),
    getPrivilege: (id: number) => ipcRenderer.invoke('request:getPrivilege', id),
    createPrivilege: (privilege: Privilege) => ipcRenderer.invoke('request:createPrivilege', privilege),
    updatePrivilege: (privilege: Privilege) => ipcRenderer.invoke('request:updatePrivilege', privilege),
    deletePrivilege: (id: number) => ipcRenderer.invoke('request:deletePrivilege', id),
    // Role
    getRoles: () => ipcRenderer.invoke('request:getRoles'),
    getRole: (id: number) => ipcRenderer.invoke('request:getRole', id),
    createRole: (role: Role) => ipcRenderer.invoke('request:createRole', role),
    updateRole: (role: Role) => ipcRenderer.invoke('request:updateRole', role),
    deleteRole: (id: number) => ipcRenderer.invoke('request:deleteRole', id),
    // Shift
    getShifts: () => ipcRenderer.invoke('request:getShifts'),
    getShift: (id: number) => ipcRenderer.invoke('request:getShift', id),
    createShift: (shift: Shift) => ipcRenderer.invoke('request:createShift', shift),
    updateShift: (shift: Shift) => ipcRenderer.invoke('request:updateShift', shift),
    deleteShift: (id: number) => ipcRenderer.invoke('request:deleteShift', id),
    // User
    getUsers: () => ipcRenderer.invoke('request:getUsers'),
    createUser: (user: User) => ipcRenderer.invoke('request:createUser', user),
    updateUser: (user: User) => ipcRenderer.invoke('request:updateUser', user),
    deleteUser: (id: number) => ipcRenderer.invoke('request:deleteUser', id),
    // Company
    getCompanies: () => ipcRenderer.invoke('request:getCompanies'),
    getcompany: (id: number) => ipcRenderer.invoke('request:getCompany', id),
    createCompany: (company: Company) => ipcRenderer.invoke('request:createCompany', company),
    updateCompany: (company: Company) => ipcRenderer.invoke('request:updateCompany', company),
    deleteCompany: (id: Company) => ipcRenderer.invoke('request:deleteCompany', id),
});