const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: './src/server.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'server.js'
	},
	module: {
		rules: [{
			test: '/\.js$/',
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	target: 'node'
}