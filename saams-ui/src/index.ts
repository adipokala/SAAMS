import { app, BrowserWindow, ipcMain } from 'electron';
import { getDesignations, createDesignation, updateDesignation, deleteDesignation, getDesignation } from './api-request/designation';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartment } from './api-request/department';
import { getPrivileges, createPrivilege, updatePrivilege, deletePrivilege, getPrivilege } from './api-request/privilege';
import { createRole, deleteRole, getRole, getRoles, updateRole } from './api-request/role';
import { createUser, deleteUser, getUsers, updateUser } from './api-request/user';
import { getShifts, createShift, updateShift, deleteShift, getShift } from './api-request/shift';
import { getCompanies, createCompany, updateCompany, deleteCompany, getCompany } from './api-request/company';
import { getAreas, createArea, updateArea, deleteArea, getArea } from './api-request/area';
import { loginUser } from './api-request/auth';
import { createChannel, deleteChannel, getChannel, getChannels, updateChannel } from './api-request/channel';
import { getRolePrivileges, createRolePrivilege, updateRolePrivilege, deleteRolePrivilege } from './api-request/role-privilege';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      //contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});


ipcMain.handle('request:loginUser', (event, json) => loginUser(json));
// Department
ipcMain.handle('request:getDepartments', () => getDepartments());
ipcMain.handle('request:getDepartment', (event, id) => getDepartment(id));
ipcMain.handle('request:createDepartment', (event, department) => createDepartment(department));
ipcMain.handle('request:updateDepartment', (event, department) => updateDepartment(department));
ipcMain.handle('request:deleteDepartment', (event, id) => deleteDepartment(id));

// Designation
ipcMain.handle('request:getDesignations', () => getDesignations());
ipcMain.handle('request:getDesignation', (event, id) => getDesignation(id));
ipcMain.handle('request:createDesignation', (event, designation) => createDesignation(designation));
ipcMain.handle('request:updateDesignation', (event, designation) => updateDesignation(designation));
ipcMain.handle('request:deleteDesignation', (event, id) => deleteDesignation(id));

// Privilege
ipcMain.handle('request:getPrivileges', () => getPrivileges());
ipcMain.handle('request:getPrivilege', (event, id) => getPrivilege(id));
ipcMain.handle('request:createPrivilege', (event, privilege) => createPrivilege(privilege));
ipcMain.handle('request:updatePrivilege', (event, privilege) => updatePrivilege(privilege));
ipcMain.handle('request:deletePrivilege', (event, id) => deletePrivilege(id));

// Role
ipcMain.handle('request:getRoles', () => getRoles());
ipcMain.handle('request:getRole', (event, id) => getRole(id));
ipcMain.handle('request:createRole', (event, role) => createRole(role));
ipcMain.handle('request:updateRole', (event, role) => updateRole(role));
ipcMain.handle('request:deleteRole', (event, id) => deleteRole(id));

// Shift
ipcMain.handle('request:getShifts', () => getShifts());
ipcMain.handle('request:getShift', (event, id) => getShift(id));
ipcMain.handle('request:createShift', (event, shift) => createShift(shift));
ipcMain.handle('request:updateShift', (event, shift) => updateShift(shift));
ipcMain.handle('request:deleteShift', (event, id) => deleteShift(id));

// User
ipcMain.handle('request:getUsers', () => getUsers());
ipcMain.handle('request:createUser', (event, user) => createUser(user));
ipcMain.handle('request:updateUser', (event, user) => updateUser(user));
ipcMain.handle('request:deleteUser', (event, id) => deleteUser(id));

// Company
ipcMain.handle('request:getCompanies', () => getCompanies());
ipcMain.handle('request:getCompany', (event, id) => getCompany(id));
ipcMain.handle('request:createCompany', (event, user) => createCompany(user));
ipcMain.handle('request:updateCompany', (event, user) => updateCompany(user));
ipcMain.handle('request:deleteCompany', (event, id) => deleteCompany(id));

// Area
ipcMain.handle('request:getAreas', () => getAreas());
ipcMain.handle('request:getArea', (event, id) => getArea(id));//changed
ipcMain.handle('request:createArea', (event, area) => createArea(area));
ipcMain.handle('request:updateArea', (event, area) => updateArea(area));
ipcMain.handle('request:deleteArea', (event, id) => deleteArea(id));

//roleprivilege
ipcMain.handle('request:getRolePrivileges', () => getRolePrivileges());
ipcMain.handle('request:createRolePrivilege', (event, rolePrivilege) => createRolePrivilege(rolePrivilege));
ipcMain.handle('request:updateRolePrivilege', (event, rolePrivilege) => updateRolePrivilege(rolePrivilege));
ipcMain.handle('request:deleteRolePrivilege', (event, id) => deleteRolePrivilege(id));

//channel
ipcMain.handle('request:getChannels', () => getChannels());
ipcMain.handle('request:getChannel', (event, id) => getChannel(id));
ipcMain.handle('request:createChannel', (event, channel) => createChannel(channel));
ipcMain.handle('request:updateChannel', (event, channel) => updateChannel(channel));
ipcMain.handle('request:deleteChannel', (event, id) => deleteChannel(id));




// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

