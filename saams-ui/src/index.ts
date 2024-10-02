import { app, BrowserWindow, ipcMain } from 'electron';
const { net } = require('electron');
import loginUser from './api-request/user';
import handleGetDesignation from './api-request/designation';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const handleOnGetIPC = async () => {
  console.log('reached through IPC');

  const id = await new Promise<dataResponse[]>((resolve, reject) => {
    // Make sure the entry exists
    const request = net.request('https://localhost:7192/api/Department');

    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk; // Collect all data chunks
      });

      response.on('end', () => {
        try {
          const data = JSON.parse(responseData);
          console.log(`${data.id}`);
          resolve(data); // Resolve the promise with the id
        } catch (error) {
          reject(error); // Reject if parsing fails
        }
        console.log('no more data');
      });
    });

    request.on('error', (error) => {
      reject(error); // Reject the promise if there's a request error
    });

    request.end();
  });

  console.log('before the return statement');
  return id;
};

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
ipcMain.handle('request:get', () => handleOnGetIPC());
ipcMain.handle('request:handleGetDesignation', () => handleGetDesignation);

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

