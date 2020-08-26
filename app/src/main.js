const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    screen
} = require('electron');

import jetpack from 'fs-jetpack';
import path from 'path';

import './excel';
import {
    loadWorkbook,
    insertData,
    worksheet
} from './excel';
import log from 'electron-log';
import {
    autoUpdater
} from "electron-updater";

autoUpdater.logger = log;
autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'valentine195',
    repo: 'john-data-entry',
    private: true
});

Object.assign(console, log.functions);

import isDev from 'electron-is-dev'; // this is required to check if the app is running in development mode.
import appUpdater from './autoupdate';

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32';
}

let userConfig;
let workbook;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {

    createWindow();

    console.log(app.getPath("userData"))

    if (jetpack.exists(path.join(app.getPath("userData"), 'config.json'))) {

        userConfig = await jetpack.readAsync(path.join(app.getPath("userData"), 'config.json', ), 'json');

    } else {
        userConfig = {
            "pathToExcelFile": ''
        };
        await jetpack.writeAsync(path.join(app.getPath("userData"), 'config.json'), JSON.stringify(userConfig))

    }


    if (!userConfig.pathToExcelFile.length || !jetpack.exists(userConfig.pathToExcelFile)) {
        let response = dialog.showMessageBoxSync({
            type: 'question',
            title: "Excel File",
            message: "An excel file could not be found. Do you wish to create a new one or select an existing?",
            buttons: ['Create', 'Select'],
            defaultId: 0
        });
        if (response == 1) {

            let selectedWorkbook = dialog.showOpenDialogSync({});

            if (selectedWorkbook.canceled) {
                dialog.showErrorBox('An excel file must be created. Quitting app.');
                app.quit();
            }
            console.log(79, selectedWorkbook)
            userConfig.pathToExcelFile = selectedWorkbook[0];
            await jetpack.write(path.join(app.getPath("userData"), 'config.json'), JSON.stringify(userConfig));

        } else {
            let savePath = dialog.showSaveDialogSync({
                title: "Create new invoice workbook...",
                defaultPath: "PackagingPlusInvoices.xlsx",
                properties: ["createDirectory"]
            });

            if (savePath.canceled) {
                dialog.showErrorBox('An excel file must be created. Quitting app.');
                app.quit();
            }

            userConfig.pathToExcelFile = savePath;

            await jetpack.write(path.join(app.getPath("userData"), 'config.json'), JSON.stringify(userConfig));

        }

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



ipcMain.on('invoice-submitted', async (e, {
    invoice
}) => {
    
    insertData(Object.values(invoice), worksheet).then(() => {
        
        mainWindow.webContents.send('success', {
            msg: 'Invoice data saved!'
        });
        
    }).catch((e) => {
        
        mainWindow.webContents.send('error', {
            msg: 'Invoice submission error. Please try again.'
        })
        
    });
    
});
let mainWindow;

const createWindow = () => {
    // Create the browser window.
    const display = screen.getPrimaryDisplay();
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));


    mainWindow.webContents.once('dom-ready', () => {

        const checkOS = isWindowsOrmacOS();
        if (checkOS) {
            // Initate auto-updates on macOs and windows

            autoUpdater.checkForUpdatesAndNotify();

            autoUpdater.on('update-downloaded', (ev, info) => {
                
                const updateDialog = dialog.showMessageBoxSync({
                    title: "Update Available",
                    message: "An update has been downloaded. Restart the app so the changes take effect!",
                    detail: "If you wish to wait to install the update, it will install when the app is closed.",
                    buttons: ["Restart", "Later"],
                    defaultId: 0,
                    cancelId: 1
                });

                if (updateDialog === 0) {

                    autoUpdater.quitAndInstall();

                } else {

                    mainWindow.webContents.send("update-downloaded");

                }
                
            });

        };
    })

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
};