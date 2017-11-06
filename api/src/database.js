//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import mongoose from 'mongoose'
import config from './config/env'

//=-=======================================
// DATABASE CONNECT
//=-=======================================
mongoose.Promise = global.Promise

mongoose.connect(config.database)

mongoose.connection.on('error', () => {
	throw new Error(`unable to connect to database: ${config.database}`)
})

mongoose.connection.on('connected', () => {
	console.log(`connected to database: ${config.database}`)
})

if (config.env === 'development') {
	mongoose.set('debug', true)
}