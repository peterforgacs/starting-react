var webpack = require('webpack'),
path = require('path');

module.exports = {
entry: {
	main: './src/index.js'
},
output: {
	path: path.join(__dirname, 'dist'),
	filename: './bundle.js',
	publicPath: "/dist/"
},
module: {
	loaders: [{
		test: /.(js|jsx|mjs)$/,
		loader: 'babel-loader',
		exclude: /node-modules/,
		query: {
		 presets: ['react', 'es2015']
		}
	}]
},
devtool: "source-map"
};