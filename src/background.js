'use strict'

import path from 'path';
import jetpack from 'fs-jetpack';

import {
	app,
	protocol,
	BrowserWindow,
	dialog,
	ipcMain,
	Menu
} from 'electron'
import {
	createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
	VUEJS_DEVTOOLS
} from 'electron-devtools-installer';

/** Install electron-log functions */
import log from 'electron-log';
Object.assign(console, log.functions);

/** Initialize electron auto updater */
import {
	autoUpdater
}
from "electron-updater";
autoUpdater.logger = log;
const isDevelopment = process.env.NODE_ENV !== 'production'

import ExcelHandler from './utils/excel';

import dotenv from 'dotenv';
dotenv.config();

const MenuTemplate = [{
		label: 'File',
		submenu: [{
				label: 'Open Excel Document',
				click: () => {
					require('child_process').exec(`start "" "${config.pathToExcelFile}"`);
				}
			},
			{
				label: 'Open Excel Document Location',
					click: () => {
						require('child_process').exec(`start "" "${path.dirname(config.pathToExcelFile)}"`);
					}
			},
			{
				type: 'separator'
			},
			{
				label: 'View Logs',
				click: () => {
					require('child_process').exec(`start "" "${app.getPath("userData")}/logs"`);
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
/* 	{
		label: 'Edit',
		submenu: [{
			label: 'Change Excel Document',
			click: () => selectWorkbook(false)
		},
		{
			label: 'Change Document Location',
			click: () => {}
		}	
	]
	}, */
	{
		label: 'Window',
		submenu: [{
				role: 'minimize'
			},
			{
				role: 'zoom'
			},
			{
				role: 'close'
			}

		]
	}
]
const menu = Menu.buildFromTemplate(MenuTemplate)
Menu.setApplicationMenu(menu)
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let workbook, config;
/** Initialize Constants */
const configPath = path.join(app.getPath("userData"), 'config.json');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
	scheme: 'app',
	privileges: {
		secure: true,
		standard: true
	}
}])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {

	//Initialize user config
	config = await getUserConfig();

	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}

	//Build main window
	createWindow();
	if (!config.pathToExcelFile.length || !jetpack.exists(config.pathToExcelFile)) {
		selectWorkbook(true);
	}
	workbook = new ExcelHandler(config.pathToExcelFile);

	win.webContents.once('dom-ready', () => {

		autoUpdater.checkForUpdatesAndNotify();

		autoUpdater.on('update-downloaded', (ev, update/* {
			version
		} */) => {
			console.log(update)
			win.webContents.send("update-downloaded", {
				version: update.version
			});

		});

		setInterval(() => {
			autoUpdater.checkForUpdatesAndNotify();
		}, 1000 * 60 * 60)

	})

})

ipcMain.on('invoice-submitted', async (e, {
	invoice
}) => {

	workbook.insertData(Object.values(invoice)).then(() => {

		win.webContents.send('success', {
			msg: 'Invoice data saved!'
		});

	}).catch((e) => {

		win.webContents.send('error', {
			msg: `Invoice submission error. This error has been logged. \n\n${e}`
		})

	});

});

ipcMain.on('restart-and-update', () => {

	autoUpdater.quitAndInstall();

});

ipcMain.on('frontend-error', (e, {
	error
}) => {

	log.error(error);

})

// #region Electron App Events */
// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})

//#endregion Electron App Events

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}

async function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
		},
		icon: path.join(__static, 'icons/icon.ico')
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		// Load the index.html when not in development
		createProtocol('app')
		win.loadURL('app://./index.html')
	}

	win.on('closed', () => {
		win = null
	})
}

async function getUserConfig() {

	if (!jetpack.exists(path.join(app.getPath("userData"), 'config.json'))) {
		const {
			default: config
		} = await import('./defaults/config');
		await jetpack.writeAsync(configPath, JSON.stringify(config))
	}

	return Promise.resolve(await jetpack.readAsync(configPath, 'json'));

}

log.catchErrors({
	showDialog: false,
	onError(error) {
		log.error(error);
		//logError(error);
	}
});

async function selectWorkbook(startup) {

	const buttons = startup ? ['Create', 'Select'] : ['Create', 'Select', 'Cancel']
	let response = dialog.showMessageBoxSync({
		type: 'question',
		title: "Excel File",
		message: "Create a new workbook or select an existing?",
		buttons: buttons,
		defaultId: 0
	});
	if (response == 1) {

		let selectedWorkbook = dialog.showOpenDialogSync({});

		if (selectedWorkbook.canceled) {
			if (!startup) return;
			dialog.showErrorBox('An excel file must be created.');
			app.quit();
		}
		config.pathToExcelFile = selectedWorkbook[0];
		await jetpack.write(path.join(app.getPath("userData"), 'config.json'), JSON.stringify(config));

	} else if (response == 0) {
		let savePath = dialog.showSaveDialogSync({
			title: "Create new invoice workbook...",
			defaultPath: "PackagingPlusInvoices.xlsx",
			properties: ["createDirectory"]
		});

		if (savePath.canceled) {
			if (!startup) return;
			dialog.showErrorBox('An excel file must be created. Quitting app.');
			app.quit();
		}

		config.pathToExcelFile = savePath;

		await jetpack.write(path.join(app.getPath("userData"), 'config.json'), JSON.stringify(config));

	}
}
