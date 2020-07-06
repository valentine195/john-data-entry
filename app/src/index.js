const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require('electron');
const Excel = require('exceljs');
const jetpack = require('fs-jetpack');

const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let userConfig;

(async () => {

  if (jetpack.exists(path.join(app.getPath("userData"), 'config.json'))) {

    userConfig = await jetpack.read(path.join(app.getPath("userData"), 'config.json', ), 'json');
    console.log(userConfig);
  } else {

    userConfig = {
      "pathToExcelFile": ''
    };
    await jetpack.write(path.join(app.getPath("userData"), 'config.json'), userConfig)

  }

  const workbook = new Excel.Workbook();

  const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      title: "Invoice Entry",
      icon: path.join(__dirname, 'public/PackagingPlusIcon.png')
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {


    createWindow();

    if (!userConfig.pathToExcelFile.length || !jetpack.exists(userConfig.pathToExcelFile)) {

      dialog.showMessageBox({
        type: 'question',
        title: "Excel File",
        message: "An excel file could not be found. Do you wish to create a new one or select an existing?",
        buttons: ['Create', 'Select'],
        defaultId: 0
      }).then(async ({ response }) => {
        console.log(response);
        if (response == 0) { 
          let savePath = await dialog.showSaveDialog({
            title: "Create new invoice workbook...",
            defaultPath: "PackagingPlusInvoices.xlsx",
            properties: [ "createDirectory" ]
          });
          if (savePath.canceled) { dialog.showErrorBox('An excel file must be created. Quitting app.'); app.quit(); }
          userConfig.pathToExcelFile = savePath.filePath;
          await jetpack.write(path.join(app.getPath("userData"), 'config.json'), userConfig);

          var sheet = workbook.addWorksheet();
          sheet.columns = [
            { header: 'Account Name', key: 'name', width: 24},
            { header: 'Account ID', key: 'id', width: 40},
            { header: 'Created Date', key: 'createdDate', width: 15},
            { header: 'Last Modified Date', key: 'lastModifiedDate', width: 20},
            { header: 'Created By', key: 'createdBy', width: 40},
            { header: 'Number Of Devices', key: 'numberOfDevices', width: 10},
            { header: 'Number Of End Users', key: 'numberOfEndUsers', width: 10}
          ];

          await workbook.xlsx.writeFile(savePath.filePath);
        }
        if (response == 1) {

          let selectedWorkbook = await dialog.showOpenDialog({

          })
          if (selectedWorkbook.canceled) { dialog.showErrorBox('An excel file must be created. Quitting app.'); app.quit(); }
          userConfig.pathToExcelFile = savePath.filePath;
          await jetpack.write(path.join(app.getPath("userData"), 'config.json'), userConfig);

          await workbook.xlsx.readFile(selectedWorkbook.filePath);

        }
      })

    } else {

      await workbook.xlsx.readFile(userConfig.pathToExcelFile)

    }
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