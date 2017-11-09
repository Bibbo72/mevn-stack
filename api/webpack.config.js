const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

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
	externals: [nodeExternals()],
	target: 'node'
}