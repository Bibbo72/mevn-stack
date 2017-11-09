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
import passport from 'passport'
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as localStrategy } from 'passport-local'

// Local Imports
import config from './env'
import User from '../models/user.model'
import Token from '../models/token.model'

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
const strategy_jwt = new jwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secret
}, async (payload, done) => {
	// console.log('payload received: ', payload)
	try {
		// verify the user exists
		const user = await User.findById(payload.sub)
		if (!user) return done(null, false, { message: 'We could not find your user account.' })

		// verify token exists
		const token = await Token.findOne({uuid: user.uuid}, '-_id token valid blacklist')
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
const strategy_local = new localStrategy({
	usernameField: 'email',
	passwordField: 'hash'
}, async (email, hash, done) => {
	try {
		// verify email
		const user = await User.findOne({ email })
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
passport.use(strategy_jwt)
passport.use(strategy_local)

//=-=======================================
// EXPORTS
//=-=======================================
export default passport