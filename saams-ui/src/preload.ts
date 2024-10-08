// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Department } from "./model/department";

contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (json: string) => ipcRenderer.invoke('request:loginUser', json),
    getDepartments: () => ipcRenderer.invoke('request:getDepartments'),
    createDepartment: (department: Department) => ipcRenderer.invoke('request:createDepartment', department),
    updateDepartment: (department: Department) => ipcRenderer.invoke('request:updateDepartment', department),
    deleteDepartment: (id: number) => ipcRenderer.invoke('request:deleteDepartment', id),
});