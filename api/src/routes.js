//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports
import express from 'express'

// Local Imports
import passport from './config/authentication'
import joi from './config/validation'

// Controllers
import AuthController from './controllers/auth.controller'
import UserController from './controllers/user.controller'
import TokenController from './controllers/token.controller'

// Constants
const router = express.Router()

// Middleware Alias'
const joi_register = joi.validate(joi.schemas.registerSchema)
const joi_login = joi.validate(joi.schemas.loginSchema)
const passport_jwt = passport.authenticate('jwt', { session: false })
const passport_local = passport.authenticate('local', { session: false })

//=-=======================================
// ROUTES
//=-=======================================
// API
router.get('/', (req, res) => res.send('REST API Route Map'))
router.get('/protected', passport_jwt, (req, res) => res.send('YOUR TOKEN WORKS'))
router.post('/protected', joi_login, passport_jwt, (req, res) => res.send('VALIDATION PASSES'))

// AUTH
router.post('/auth/register', joi_register, AuthController.register)
router.delete('/auth/unregister', joi_login, passport_local, AuthController.unregister)
router.post('/auth/login', joi_login, passport_local, AuthController.login)
router.delete('/auth/logout', passport_jwt, AuthController.logout)

// TOKENS
router.get('/tokens', TokenController.index)
router.get('/tokens/blacklist', TokenController.blacklist)

// USERS
router.route('/users')
	.get(UserController.index)
	.post(UserController.post)

router.route('/users/:username')
	.get(UserController.get)
	.put(UserController.put)
	.delete(UserController.delete)

// // /**
// //  * DEVELOPMENT ROUTES ONLY, DELETE FOR PRODUCTION
// //  */
// router.get('/init', UserController.init) // DEVELOPMENT ONLY, INITIATES DEFAULT ADMIN, DO NOT USE IN PRODUCTION!!!!!
// router.get('/purge', UserController.purge) // DEVELOPMENT ONLY, PURGES ALL DATABASE USERS, DO NOT USE IN PRODUCTION!!!!!

//=-=======================================
// EXPORTS
//=-=======================================
export default router