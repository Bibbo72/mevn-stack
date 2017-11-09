/**
 * DATABASE CONFIGURATION
 *
 * This API uses Mongoose as the ORM to make calls
 * to MongoDB. You can configure your database config
 * here.
 * 
 */

//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import mongoose from 'mongoose'
import config from './env'

//=-=======================================
// DATABASE CONNECT
//=-=======================================
mongoose.Promise = global.Promise

mongoose.connection.openUri(`mongodb://${config.database}`)
	.on('error', () => {
		throw new Error(`unable to connect to database: ${config.database}`)
	})
	.on('connected', () => {
		console.log(`connected to database: ${config.database}:27017`)
	})

if (config.env === 'development') {
	mongoose.set('debug', true)
}