/**
 * EXPRESS SERVER CONFIGURATION
 *
 * This is the main Express server configuration
 * file and it contains all of your middleware
 * instances as well as your routes.
 * 
 */

//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'

// Local Imports
import routes from '../routes'
import passport from '../config/authentication'

// Constants
const app = express()

//=-=======================================
// MIDDLEWARE
//=-=======================================
// Helmet
app.use(helmet())

// CORS Headers
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

// Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Passport
app.use(passport.initialize())

// Morgan
app.use(morgan('dev'))

//=-=======================================
// ROUTES
//=-=======================================
app.use('/api', routes)

//=-=======================================
// EXPORTS
//=-=======================================
export default app