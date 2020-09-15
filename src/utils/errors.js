import log from 'loglevel';
import Vue from 'vue';
import Notifications from 'vue-notification';

Vue.use(Notifications);

function handleError({
    text,
    title = "Error"
} = {}) {
    text = text.toString().replace(/\w+:\s/, "");
    Vue.prototype.$notify({
        group: "error",
        title: title,
        type: "error",
        duration: -1,
        text: text
    });
}

function install(Vue) {

    Vue.prototype.$handleError = handleError;

    log.log("Installed Error Handler");

    Vue.config.errorHandler = (err) => {
        handleError({
            text: err,
            title: 'Dashboard Error'
        });
    };

    window.onerror = (err) => {
        handleError({
            text: err
        });
    }

    window.onunhandledrejection = (event) => {
        //handle error here
        //event.promise contains the promise object
        //event.reason contains the reason for the rejection
        event.preventDefault();

        handleError({
            text: event.reason.message,
            error: event
        });

    }
}

export default install;