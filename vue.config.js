const pkg = require('./package.json');

module.exports = {
	publicPath: '',
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			builderOptions: {
				"asarUnpack": [],
				"appId": "packaging-plus",
				"win": {
					"icon": "./src/build/icons/icon.ico"
				},
				"nsis": {
					"artifactName": "${productName}-Setup-${version}.${ext}",
					"oneClick": true,
					"perMachine": false,
					"deleteAppDataOnUninstall": true,
					"allowToChangeInstallationDirectory": false,
					"runAfterFinish": true,
					"differentialPackage": true
				},
				"files": [
					"**/*",
					"!dev_environment.js",
					"!**/dist_electron/*",
					"!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
					"!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
					"!**/node_modules/*.d.ts",
					"!**/node_modules/.bin",
					"!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
					"!.editorconfig",
					"!**/._*",
					"!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
					"!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
					"!**/{appveyor.yml,.travis.yml,circle.yml}",
					"!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",
					"**/.env.local"
				],
				"publish": [{
					"provider": "github",
					"owner": "valentine195",
					"repo": "john-data-entry"
				}]
			}
		}
	},
	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = pkg.productName;
				return args;
			})
	}
};