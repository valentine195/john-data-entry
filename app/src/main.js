import {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} from 'electron';

import jetpack from 'fs-jetpack';
import path from 'path';

import './excel';
import {
    loadWorkbook,
    insertData,
    worksheet
} from './excel';

import isDev from 'electron-is-dev'; // this is required to check if the app is running in development mode. 
import appUpdater from './autoupdate';

/* Handling squirrel.windows events on windows 
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (import('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32';
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let userConfig;
let workbook;

(async () => {

    if (jetpack.exists(path.join(app.getPath("userData"), 'config.json'))) {

        userConfig = await jetpack.read(path.join(app.getPath("userData"), 'config.json', ), 'json');

    } else {

        userConfig = {
            "pathToExcelFile": ''
        };
        await jetpack.write(path.join(app.getPath("userData"), 'config.json'), userConfig)

    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {


        createWindow();

        console.log("userConfig", userConfig)
        if (!userConfig.pathToExcelFile.length || !jetpack.exists(userConfig.pathToExcelFile)) {

            let response = dialog.showMessageBoxSync({
                type: 'question',
                title: "Excel File",
                message: "An excel file could not be found. Do you wish to create a new one or select an existing?",
                buttons: ['Create', 'Select'],
                defaultId: 0
            })
            /* .then(async ({
                            response
                        }) => { */

            if (response == 0) {
                let savePath = await dialog.showSaveDialog({
                    title: "Create new invoice workbook...",
                    defaultPath: "PackagingPlusInvoices.xlsx",
                    properties: ["createDirectory"]
                });

                if (savePath.canceled) {
                    dialog.showErrorBox('An excel file must be created. Quitting app.');
                    app.quit();
                }

                userConfig.pathToExcelFile = savePath.filePath;

                await jetpack.write(path.join(app.getPath("userData"), 'config.json'), userConfig);

            }
            if (response == 1) {

                let selectedWorkbook = await dialog.showOpenDialog({});

                if (selectedWorkbook.canceled) {
                    dialog.showErrorBox('An excel file must be created. Quitting app.');
                    app.quit();
                }
                userConfig.pathToExcelFile = savePath.filePath;
                await jetpack.write(path.join(app.getPath("userData"), 'config.json'), userConfig);

            }
            /* 
                        }); */
        }

        workbook = await loadWorkbook(userConfig.pathToExcelFile);

    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
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


})()

ipcMain.on('invoice-submitted', async (e, {
    invoice
}) => {

    await insertData(Object.values(invoice), worksheet);

})

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Invoice Entry",
        icon: path.join(__dirname, 'public/PackagingPlusIcon.png'),
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));


    mainWindow.webContents.once('dom-ready', () => {

        const checkOS = isWindowsOrmacOS();
        if (checkOS && !isDev) {
            // Initate auto-updates on macOs and windows
            appUpdater();
        };
    })

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
};