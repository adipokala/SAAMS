// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Department } from "./model/department";
import { Designation } from "./model/designation";
import { Privilege } from "./model/privilege";
import { Role } from "./model/role";
import { Shift } from "./model/shift";

contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (json: string) => ipcRenderer.invoke('request:loginUser', json),
    // Department
    getDepartments: () => ipcRenderer.invoke('request:getDepartments'),
    createDepartment: (department: Department) => ipcRenderer.invoke('request:createDepartment', department),
    updateDepartment: (department: Department) => ipcRenderer.invoke('request:updateDepartment', department),
    deleteDepartment: (id: number) => ipcRenderer.invoke('request:deleteDepartment', id),
    // Designation
    getDesignations: () => ipcRenderer.invoke('request:getDesignations'),
    createDesignation: (designation: Designation) => ipcRenderer.invoke('request:createDesignation', designation),
    updateDesignation: (designation: Designation) => ipcRenderer.invoke('request:updateDesignation', designation),
    deleteDesignation: (id: number) => ipcRenderer.invoke('request:deleteDesignation', id),
    // Privilege
    getPrivileges: () => ipcRenderer.invoke('request:getPrivileges'),
    createPrivilege: (privilege: Privilege) => ipcRenderer.invoke('request:createPrivilege', privilege),
    updatePrivilege: (privilege: Privilege) => ipcRenderer.invoke('request:updatePrivilege', privilege),
    deletePrivilege: (id: number) => ipcRenderer.invoke('request:deletePrivilege', id),
    // Role
    getRoles: () => ipcRenderer.invoke('request:getRoles'),
    createRole: (role: Role) => ipcRenderer.invoke('request:createRole', role),
    updateRole: (role: Role) => ipcRenderer.invoke('request:updateRole', role),
    deleteRole: (id: number) => ipcRenderer.invoke('request:deleteRole', id),
    // Shift
    getShifts: () => ipcRenderer.invoke('request:getShifts'),
    createShift: (shift: Shift) => ipcRenderer.invoke('request:createShift', shift),
    updateShift: (shift: Shift) => ipcRenderer.invoke('request:updateShift', shift),
    deleteShift: (id: number) => ipcRenderer.invoke('request:deleteShift', id),
});