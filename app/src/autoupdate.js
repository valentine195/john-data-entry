//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
import {
    autoUpdater
} from "electron-updater";


export default function appUpdater(app, log) {

    autoUpdater.logger = log;

/*     const server = 'https://hazel.valentine195.vercel.app/'
    const feedURL = `${server}/update/${process.platform}/${app.getVersion()}` */

    autoUpdater.setFeedURL({
        provider: 'github',
        token: '0cbcebc2550c07518d97dc88acb0f629a8f25d28',
        owner: 'valentine195',
        repo: 'john-data-entry',
        private: true
    });

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', (ev, info) => {

        console.log(info);

    });

    autoUpdater.on('update-downloaded', (ev, info) => {

        autoUpdater.quitAndInstall();

    });

}