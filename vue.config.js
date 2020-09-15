const package = require('./package.json');

module.exports = {
	publicPath: '',
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true
		}
	},
	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = package.productName;
				return args;
			})
	}
};