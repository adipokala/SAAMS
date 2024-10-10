// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Department } from "./model/department";
import { Designation } from "./model/designation";

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
});