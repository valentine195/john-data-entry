<template lang='pug'>
#app.d-flex.flex-column.justify-content-between
	.d-flex.align-items-center.update-banner(v-if="updateDownloaded")
		small.fas.fa-cloud-download-alt.mr-1
		small An updated version is available and will be installed at the next launch. See
			|#[a(:href="this.path", target="_blank", @click.prevent="openExternalBrowser") what's new]
			| or #[a(href="#", @click.prevent.stop="restartAndUpdate") restart to install now].
		a.ml-auto.mr-1(href="#", @click.prevent.stop="updateDownloaded = false")
			small.fas.fa-times.text-danger
	router-view.mb-auto
	notifications(group="success")
	notifications(group="error")
</template>
<script>
import InvoiceInput from "./views/InvoiceInput";
import { ipcRenderer, remote } from "electron";
export default {
	name: "App",
	data: () => {
		return {
			updateDownloaded: false,
			path: "https://github.com/valentine195/john-data-entry/releases/",
		};
	},
	components: {
		InvoiceInput,
	},
	methods: {
		openExternalBrowser(e) {
			remote.shell.openExternal(e.target.href);
		},
		restartAndUpdate() {
			ipcRenderer.send("restart-and-update");
		},
	},
	mounted: function () {
		ipcRenderer.on("success", (e, { msg }) => {
			this.$notify({
				group: "success",
				text: msg,
				type: "success",
			});
		});
		ipcRenderer.on("error", (e, { msg }) => {
			this.$notify({
				group: "error",
				text: msg,
				type: "error",
			});
		});
		ipcRenderer.on("update-downloaded", ({ version }) => {
			this.updateDownloaded = true;
			this.path = `https://github.com/valentine195/john-data-entry/releases/tag/${version}`;
		});
	},
};
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

input[disabled] {
	background-color: var(--light);
}

ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
.update-banner {
	background-color: rgba(211, 211, 211, 0.5);
	padding: 0.25rem;
	text-align: left;
}
</style>
