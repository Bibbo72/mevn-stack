/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * ENVIRONMENT CONFIG
 *
 * This file contains your environment variables.
 * For now, you'll have to define your own .ENV file
 * until a production default is made available.
 * 
 */
/* harmony default export */ __webpack_exports__["a"] = ({
	env: process.env.NODE_ENV || 'development',
	debug: process.env.DEBUG || 'false',
	port: process.env.PORT || 3000,
	host: process.env.HOST || '127.0.0.1',
	secret: process.env.SECRET || 'nW67713n!gqE',
	database: process.env.DATABASE_SERVER || 'mevn_db/jackievn',
	cache: process.env.CACHE_SERVER || 'mevn_cs',
	mail: process.env.MAIL_SERVER || '',
	timezone: process.env.TIMEZONE || '',
	locale: process.env.LOCALE || 'en'
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bcryptjs__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bcryptjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bcryptjs__);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================



const Schema = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema

//=-=======================================
// DATABASE SCHEMA
//=-=======================================
const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	hash: { type: String, required: true },
	role: { type: String, required: true, enum: ['ROLE_ADMIN', 'ROLE_USER'], default: 'ROLE_USER' },
	uuid: { type: String, required: true, unique: true },
	resetPasswordToken: { type: String, select: false },
	resetPasswordExpires: { type: Date, select: false }
},
{
	timestamps: true
})

//=-=======================================
// PRE
//=-=======================================
/**
 * [Hash a password with Bcrypt before saving it to Mongo]
 */
UserSchema.pre('save', async function(next) {
	try {
		const salt = await __WEBPACK_IMPORTED_MODULE_1_bcryptjs___default.a.genSalt(12)
		const hash = await __WEBPACK_IMPORTED_MODULE_1_bcryptjs___default.a.hash(this.hash, salt)
		this.hash = hash
		next()
	}
	catch(err) {
		next(err)
	}
})

/**
 * [If there is a password update with the request, hash it before updating]
 */
UserSchema.pre('findOneAndUpdate', async function(next) {
	try {
		if (this._update.hash) {
			const salt = await __WEBPACK_IMPORTED_MODULE_1_bcryptjs___default.a.genSalt(10)
			const hash = await __WEBPACK_IMPORTED_MODULE_1_bcryptjs___default.a.hash(this._update.hash, salt)

			this._update.hash = hash
		}
		next()
	}
	catch(err) {
		next(err)
	}
})

//=-=======================================
// METHODS
//=-=======================================
/**
 * [Hash password then verify the hash against the database]
 * @return { boolean } [returns True if there is a match]
 */
UserSchema.methods.verifyHash = async function(password) {
	try {
		return await __WEBPACK_IMPORTED_MODULE_1_bcryptjs___default.a.compare(password, this.hash)
	}
	catch(err) {
		throw new Error(err)
	}
}

//=-=======================================
// EXPORTS
//=-=======================================
const user = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('User', UserSchema)

/* harmony default export */ __webpack_exports__["a"] = (user);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsonwebtoken__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jsonwebtoken__);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================



const Schema = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema

//=-=======================================
// DATABASE SCHEMA
//=-=======================================
const TokenSchema = new Schema({
	token: { type: String, required: true, unique: true },
	uuid: { type: String, required: true, unique: true },
	valid: { type: Boolean, required: true, default: false },
	blacklist: { type: Boolean, required: true, default: false }
},
{
	timestamps: true
})

//=-=======================================
// PRE
//=-=======================================

//=-=======================================
// METHODS
//=-=======================================

//=-=======================================
// EXPORTS
//=-=======================================
const token = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('Token', TokenSchema)

/* harmony default export */ __webpack_exports__["a"] = (token);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_jwt__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_passport_local__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_passport_local___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_passport_local__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__env__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_user_model__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_token_model__ = __webpack_require__(3);
/**
 * AUTHENTICATION CONFIGURATION
 *
 * This API uses Passport and JSON Web Tokens for
 * authentication. It is imported into the routes
 * to use the authentication strategies as middleware
 * when parsing HTTP requests.
 * 
 */

//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports




// Local Imports




//=-=======================================
// PASSPORT STRATEGIES
//=-=======================================
/**
 * JWT STRATEGY
 * [Auth strategy for JSON Web Tokens]
 * 
 * @param {obj} [options]
 * @param {function} [payload]
 * @return {obj} [user]
 */
const strategy_jwt = new __WEBPACK_IMPORTED_MODULE_1_passport_jwt__["Strategy"]({
	jwtFromRequest: __WEBPACK_IMPORTED_MODULE_1_passport_jwt__["ExtractJwt"].fromAuthHeaderAsBearerToken(),
	secretOrKey: __WEBPACK_IMPORTED_MODULE_3__env__["a" /* default */].secret
}, async (payload, done) => {
	// console.log('payload received: ', payload)
	try {
		// verify the user exists
		const user = await __WEBPACK_IMPORTED_MODULE_4__models_user_model__["a" /* default */].findById(payload.sub)
		if (!user) return done(null, false, { message: 'We could not find your user account.' })

		// verify token exists
		const token = await __WEBPACK_IMPORTED_MODULE_5__models_token_model__["a" /* default */].findOne({uuid: user.uuid}, '-_id token valid blacklist')
		if (!token) return done(null, false, { message: 'Your token could not be verified.' })
		
		// verify token is valid and not blacklisted
		if (token.valid !== true || token.blacklist !== false) return done(null, false, { message: 'Your token is no longer valid.' })

		// return the user
		done(null, user)
	}
	catch(err) {
		done(err, false)
	}
})

/**
 * LOCAL STRATEGY
 * [Auth strategy for local 'logins']
 * 
 * @param {obj} [options]
 * @param {function} [payload]
 * @return {obj} [user]
 */
const strategy_local = new __WEBPACK_IMPORTED_MODULE_2_passport_local__["Strategy"]({
	usernameField: 'email',
	passwordField: 'hash'
}, async (email, hash, done) => {
	try {
		// verify email
		const user = await __WEBPACK_IMPORTED_MODULE_4__models_user_model__["a" /* default */].findOne({ email })
		if (!user) return done(null, false, { message: 'Your email address was not found.' })

		// verify hash
		const validHash = await user.verifyHash(hash)
		if (!validHash) return done(null, false, { message: 'Your password is incorrect.' })

		// return the user
		done(null, user)
	}
	catch(err) {
		done(err, false)
	}
})

// use passport config
__WEBPACK_IMPORTED_MODULE_0_passport___default.a.use(strategy_jwt)
__WEBPACK_IMPORTED_MODULE_0_passport___default.a.use(strategy_local)

//=-=======================================
// EXPORTS
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_passport___default.a);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_express__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_env__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_database__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_cache__ = __webpack_require__(26);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports

// Local Imports





// import acl from './config/authorization'

//=-=======================================
// START SERVER
//=-=======================================
if (!module.parent) __WEBPACK_IMPORTED_MODULE_0__config_express__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_1__config_env__["a" /* default */].port, () => console.log(`server is running on http://localhost:${__WEBPACK_IMPORTED_MODULE_1__config_env__["a" /* default */].port}`))

//=-=======================================
// EXPORTS
//=-=======================================
/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__config_express__["a" /* default */]);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(9)(module)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_parser__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_morgan__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_morgan___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_morgan__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_helmet__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_helmet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_helmet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routes__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_authentication__ = __webpack_require__(5);
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





// Local Imports



// Constants
const app = __WEBPACK_IMPORTED_MODULE_0_express___default()()

//=-=======================================
// MIDDLEWARE
//=-=======================================
// Helmet
app.use(__WEBPACK_IMPORTED_MODULE_3_helmet___default()())

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
app.use(__WEBPACK_IMPORTED_MODULE_1_body_parser___default.a.json())
app.use(__WEBPACK_IMPORTED_MODULE_1_body_parser___default.a.urlencoded({ extended: true }))

// Passport
app.use(__WEBPACK_IMPORTED_MODULE_5__config_authentication__["a" /* default */].initialize())

// Morgan
app.use(__WEBPACK_IMPORTED_MODULE_2_morgan___default()('dev'))

//=-=======================================
// ROUTES
//=-=======================================
app.use('/api', __WEBPACK_IMPORTED_MODULE_4__routes__["a" /* default */])

//=-=======================================
// EXPORTS
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = (app);

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_authentication__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_validation__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_auth_controller__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_user_controller__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_token_controller__ = __webpack_require__(24);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports


// Local Imports



// Controllers




// Constants
const router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router()

// Middleware Alias'
const joi_register = __WEBPACK_IMPORTED_MODULE_2__config_validation__["a" /* default */].validate(__WEBPACK_IMPORTED_MODULE_2__config_validation__["a" /* default */].schemas.registerSchema)
const joi_login = __WEBPACK_IMPORTED_MODULE_2__config_validation__["a" /* default */].validate(__WEBPACK_IMPORTED_MODULE_2__config_validation__["a" /* default */].schemas.loginSchema)
const passport_jwt = __WEBPACK_IMPORTED_MODULE_1__config_authentication__["a" /* default */].authenticate('jwt', { session: false })
const passport_local = __WEBPACK_IMPORTED_MODULE_1__config_authentication__["a" /* default */].authenticate('local', { session: false })

//=-=======================================
// ROUTES
//=-=======================================
// API
router.get('/', (req, res) => res.send('REST API Route Map'))
router.get('/protected', passport_jwt, (req, res) => res.send('YOUR TOKEN WORKS'))
router.post('/protected', joi_login, passport_jwt, (req, res) => res.send('VALIDATION PASSES'))

// AUTH
router.post('/auth/register', joi_register, __WEBPACK_IMPORTED_MODULE_3__controllers_auth_controller__["a" /* default */].register)
router.delete('/auth/unregister', joi_login, passport_local, __WEBPACK_IMPORTED_MODULE_3__controllers_auth_controller__["a" /* default */].unregister)
router.post('/auth/login', joi_login, passport_local, __WEBPACK_IMPORTED_MODULE_3__controllers_auth_controller__["a" /* default */].login)
router.delete('/auth/logout', passport_jwt, __WEBPACK_IMPORTED_MODULE_3__controllers_auth_controller__["a" /* default */].logout)

// TOKENS
router.get('/tokens', __WEBPACK_IMPORTED_MODULE_5__controllers_token_controller__["a" /* default */].index)
router.get('/tokens/blacklist', __WEBPACK_IMPORTED_MODULE_5__controllers_token_controller__["a" /* default */].blacklist)

// USERS
router.route('/users')
	.get(__WEBPACK_IMPORTED_MODULE_4__controllers_user_controller__["a" /* default */].index)
	.post(__WEBPACK_IMPORTED_MODULE_4__controllers_user_controller__["a" /* default */].post)

router.route('/users/:username')
	.get(__WEBPACK_IMPORTED_MODULE_4__controllers_user_controller__["a" /* default */].get)
	.put(__WEBPACK_IMPORTED_MODULE_4__controllers_user_controller__["a" /* default */].put)
	.delete(__WEBPACK_IMPORTED_MODULE_4__controllers_user_controller__["a" /* default */].delete)

// // /**
// //  * DEVELOPMENT ROUTES ONLY, DELETE FOR PRODUCTION
// //  */
// router.get('/init', UserController.init) // DEVELOPMENT ONLY, INITIATES DEFAULT ADMIN, DO NOT USE IN PRODUCTION!!!!!
// router.get('/purge', UserController.purge) // DEVELOPMENT ONLY, PURGES ALL DATABASE USERS, DO NOT USE IN PRODUCTION!!!!!

//=-=======================================
// EXPORTS
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_joi__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_joi__);
/**
 * VALIDATION CONFIGURATION
 *
 * This API uses Joi for validating post bodies
 * against Joi's API. You can create validation
 * schemas for your models here.
 * 
 */

//=-=======================================
// IMPORTS
//=-=======================================


//=-=======================================
// EXPORTS
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = ({
	validate: (schema) => {
		return (req, res, next) => {
			const result = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.validate(req.body, schema)
			if (result.error) return res.status(400).json(result.error)
			if (!req.value) { req.value = {} }
			req.value['body'] = result.value
			next()
		}
	},

	schemas: {
		registerSchema: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
			username: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().alphanum().min(4).max(16).required(),
			email: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email().required(),
			hash: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().regex(/^[a-zA-Z0-9]{8,32}$/).required()
		}),

		loginSchema: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
			email: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email().required(),
			hash: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().regex(/^[a-zA-Z0-9]{8,32}$/).required()
		})
	}
});

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_uuid_v4__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_uuid_v4___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_uuid_v4__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_env__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_user_model__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_token_model__ = __webpack_require__(3);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM imports



// Local imports




//=-=======================================
// HELPER METHODS
//=-=======================================
const signToken = (user) => {
	return __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken___default.a.sign({
		iss: '',
		sub: user.id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 1)
	}, __WEBPACK_IMPORTED_MODULE_2__config_env__["a" /* default */].secret)
}

const saveToken = async (token, uuid) => {
	const accessToken = await new __WEBPACK_IMPORTED_MODULE_4__models_token_model__["a" /* default */]({ token, uuid, valid: true })
	return await accessToken.save()
}

//=-=======================================
// EXPORT
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = ({
	/**
	 * REGISTER API USER
	 * @return { token } [JSON Web Token]
	 */
	register: async (req, res, next) => {
		try {
			// assign values to req.value.body
			const { username, email, hash } = req.value.body

			// check duplicate user
			const duplicateUser = await __WEBPACK_IMPORTED_MODULE_3__models_user_model__["a" /* default */].findOne({ username })
			if (duplicateUser) { return res.status(403).json({ error: 'Sorry, that username is already being used.' }) }

			// check duplicate email
			const duplicateEmail = await __WEBPACK_IMPORTED_MODULE_3__models_user_model__["a" /* default */].findOne({ email })
			if (duplicateEmail) { return res.status(403).json({ error: 'That email address is already being used.' }) }

			// generate a random UUID
			const uuid = __WEBPACK_IMPORTED_MODULE_1_uuid_v4___default()()

			// save the user to the database
			const user = new __WEBPACK_IMPORTED_MODULE_3__models_user_model__["a" /* default */]({ username, email, hash, uuid })
			await user.save()

			// sign, save, and respond with a json web token
			const token = `bearer ${ signToken(user) }`
			saveToken(token, uuid)
			res.status(201).json({ token })
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * UNREGISTER USER & PURGE TOKENS
	 */
	unregister: async(req, res, next) => {
		try {
			///////////////////////////////////////////////////////////////////////
			// NOTE: routes -> joi validation -> passport local strategy -> this //
			///////////////////////////////////////////////////////////////////////

			// get user from req.user
			const { uuid, email } = req.user
			const user = await __WEBPACK_IMPORTED_MODULE_3__models_user_model__["a" /* default */].findOne({uuid})

			// get token from headers
			const token = req.get('Authorization')

			// find tokens with user.uuid and destroy them
			// 
			// NOTE: although users should only have one active token at a time,
			// this makes sure that all leftover expired tokens and/or maliciously
			// forged tokens are purged from the database. If your database gets
			// too big, you may need to implement a more scalable solution for
			// performance.
			await __WEBPACK_IMPORTED_MODULE_4__models_token_model__["a" /* default */].deleteMany({uuid})

			// find and destroy the user by email and uuid
			await __WEBPACK_IMPORTED_MODULE_3__models_user_model__["a" /* default */].remove({email, uuid})
			res.status(204).json({ message: `We've destroyed your user account and access token.` })
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * LOGIN LOCAL USER
	 * @return { token } [JSON Web Token]
	 */
	login: async (req, res, next) => {
		///////////////////////////////////////////////////////////////////////
		// NOTE: routes -> joi validation -> passport local strategy -> this //
		///////////////////////////////////////////////////////////////////////

		// get the uuid from user
		const uuid = req.user.uuid

		// check for active tokens
		// 
		// NOTE: This is because front end devs will always forget to
		// store the tokens into a cookie. This will at least (relatively)
		// foolproof the server from allowing users to have multiple tokens.
		const activeToken = await __WEBPACK_IMPORTED_MODULE_4__models_token_model__["a" /* default */].findOne({uuid})
		if (activeToken) await __WEBPACK_IMPORTED_MODULE_4__models_token_model__["a" /* default */].remove({uuid})

		// sign and respond with a new token
		const token = `bearer ${ signToken(req.user) }`
		saveToken(token, uuid)
		res.status(200).json({ token })
	},

	/**
	 * LOGOUT LOCAL USER & DESTROY JWT
	 */
	logout: async(req, res, next) => {
		try {
			// get token from headers then remove it from the database
			const token = req.get('Authorization')
			await __WEBPACK_IMPORTED_MODULE_4__models_token_model__["a" /* default */].remove({ token })
			res.status(204).json({ message: `We've destroyed your access token. Please login to obtain another.` })
		}
		catch(err) {
			next(err)
		}
	}
});

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("uuid/v4");

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_user_model__ = __webpack_require__(1);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================


//=-=======================================
// EXPORT: HTTP METHODS
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = ({

	/**
	 * INDEX
	 * @return { obj } [returns all users]
	 */
	index: async (req, res, next) => {
		try {
			const users = await __WEBPACK_IMPORTED_MODULE_0__models_user_model__["a" /* default */].find({}, '-_id username email updatedAt createdAt uuid')
			res.status(200).json(users)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * GET
	 * @return { obj } [returns a single user]
	 */
	get: async (req, res, next) => {
		try {
			const user = await __WEBPACK_IMPORTED_MODULE_0__models_user_model__["a" /* default */].findOne({username: req.params.username}, '-_id username email updatedAt createdAt')
			res.status(200).json(user)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * POST
	 * @return { obj } [returns newly created user]
	 */
	post: async (req, res, next) => {
		try {
			const user = new __WEBPACK_IMPORTED_MODULE_0__models_user_model__["a" /* default */](req.body)
			await user.save()
			res.status(201).json(user)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * PUT
	 * @return { obj } [returns success message]
	 */
	put: async (req, res, next) => {
		try {
			const user = await __WEBPACK_IMPORTED_MODULE_0__models_user_model__["a" /* default */].findOneAndUpdate({username: req.params.username}, req.body, {new: true})
			res.status(204).json({message: `Account information for user ${user.username} was updated`})
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * PUT
	 * @return { obj } [deletes user, returns success message]
	 */
	delete: async (req, res, next) => {
		try {
			await __WEBPACK_IMPORTED_MODULE_0__models_user_model__["a" /* default */].remove({username: req.params.username})
			res.status(204).json({ message: `The user ${req.params.username} was successfully deleted.` })
		}
		catch(err) {
			next(err)
		}
	},

	// // DEVELOPMENT FUNCTIONS ONLY!!! REMOVE FOR PRODUCTION!!!
	// /**
	//  * INITIALIZE
	//  * @return {obj} [creates a default administrator]
	//  */
	// init: async (req, res, next) => {
	// 	try {
	// 		const user = new User({
	// 			username: 'admin',
	// 			email: 'admin@admin.com',
	// 			hash: 'admin',
	// 			role: 'ROLE_ADMIN',
	// 			uuid: '1234-1234-1234-1234'
	// 		})
	// 		await user.save()
	// 		res.status(201).json(user)
	// 	}
	// 	catch(err) {
	// 		next(err)
	// 	}
	// },

	// /**
	//  * PURGE
	//  * @return {obj} [deletes all users from the database]
	//  */
	// purge: async (req, res, next) => {
	// 	try {
	// 		await User.deleteMany({})
	// 		await Token.deleteMany({})
	// 		res.json({ message: 'The Users table was purged. Hope you meant to do that... #monkas' })
	// 	}
	// 	catch(err) {
	// 		next(err)
	// 	}
	// }
});

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_token_model__ = __webpack_require__(3);
//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================


//=-=======================================
// EXPORT
//=-=======================================
/* harmony default export */ __webpack_exports__["a"] = ({
	/**
	 * GET ACTIVE JWTS
	 */
	index: async(req, res, next) => {
		try {
			const tokens = await __WEBPACK_IMPORTED_MODULE_0__models_token_model__["a" /* default */].find({}, '-_id token uuid valid blacklist')
			res.status(200).json(tokens)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * GET BLACKLISTED JWTS
	 */
	blacklist: async(req, res, next) => {
		try {
			const tokens = await __WEBPACK_IMPORTED_MODULE_0__models_token_model__["a" /* default */].find({blacklist: true}, '-_id token uuid valid blacklist')
			res.status(200).json({ tokens })
		}
		catch(err) {
			next(err)
		}
	}
});

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__env__ = __webpack_require__(0);
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



//=-=======================================
// DATABASE CONNECT
//=-=======================================
__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = global.Promise

__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connection.openUri(`mongodb://${__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].database}`)
	.on('error', () => {
		throw new Error(`unable to connect to database: ${__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].database}`)
	})
	.on('connected', () => {
		console.log(`connected to database: ${__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].database}:27017`)
	})

if (__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].env === 'development') {
	__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.set('debug', true)
}

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redis__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redis___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redis__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__env__ = __webpack_require__(0);
/**
 * CACHE INSTANCE CONFIGURATION
 *
 * CURRENTLY UNDER CONSTRUCTION
 *
 * As you've noticed with the project, it comes with a 
 * cs (cache server) directory containing the volumes for
 * a Redis server. Redis in this project will have the
 * following features:
 *
 * * Cache index routes for models
 * * Cache JWTs
 * * Configured as a LRU cache
 *
 * This feature will be rolled out when a production
 * configuration is implemented, as you won't really
 * need to cache anything until then.
 *
 * In case you decide to work with Redis in this project,
 * you can import the redis client instance into any other
 * file to use node-redis functions. 
 */

//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================



//=-=======================================
// CACHE SERVER CONNECT
//=-=======================================
const client = __WEBPACK_IMPORTED_MODULE_0_redis___default.a.createClient({ host: __WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].cache })

client.on('error', (err) => {
	console.log(`unable to connect to cache server: ${__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].cache}:6379`)
	console.log(err)
})

client.on('ready', () => {
	console.log(`connected to cache server: ${__WEBPACK_IMPORTED_MODULE_1__env__["a" /* default */].cache}:6379`)
})

/* unused harmony default export */ var _unused_webpack_default_export = (client);

/***/ })
/******/ ]);