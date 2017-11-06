//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports
import express from 'express'

// Local Imports
import passport from './config/passport'
import joi from './config/joi'
import AuthController from './controllers/auth.controller'
import UserController from './controllers/user.controller'

// Constants
const router = express.Router()
const auth_jwt = passport.authenticate('jwt', { session: false })
const auth_local = passport.authenticate('local', { session: false })
const validate_register = joi.validate(joi.schemas.registerSchema)
const validate_login = joi.validate(joi.schemas.loginSchema)

//=-=======================================
// ROUTES
//=-=======================================
// API
router.get('/', (req, res) => res.send('REST API Route Map'))
router.get('/status', auth_jwt, (req, res) => res.send('YOUR TOKEN WORKS'))
router.post('/status', validate_login, (req, res) => res.send('VALIDATION PASSES'))


// AUTH
router.post('/auth/login', validate_login, auth_local, AuthController.login)
router.post('/auth/register', validate_register, AuthController.register)

// USERS
router.route('/users')
	.get(UserController.index)
	.post(UserController.post)

router.route('/users/:username')
	.get(UserController.get)
	.put(UserController.put)
	.delete(UserController.delete)

/**
 * DEVELOPMENT FUNCTIONS ONLY, DELETE FOR PRODUCTION
 */
router.get('/init', UserController.init) // DEVELOPMENT ONLY, INITIATES DEFAULT ADMIN, DO NOT USE IN PRODUCTION!!!!!
router.get('/purge', UserController.purge) // DEVELOPMENT ONLY, PURGES ALL DATABASE USERS, DO NOT USE IN PRODUCTION!!!!!

//=-=======================================
// EXPORTS
//=-=======================================
export default router