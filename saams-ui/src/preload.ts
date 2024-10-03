// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    loginUser: (json: string) => ipcRenderer.invoke('request:loginUser', json),
    getDepartments: () => ipcRenderer.invoke('request:getDepartments')
});