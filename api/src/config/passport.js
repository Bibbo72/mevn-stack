//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports
import passport from 'passport'
// import { Strategy, ExtractJwt } from 'passport-jwt'
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as localStrategy } from 'passport-local'

// Local Imports
import config from './env'
import User from '../models/user.model'

//=-=======================================
// PASSPORT OPTIONS
//=-=======================================
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secret
}

//=-=======================================
// PASSPORT STRATEGIES
//=-=======================================
// JWT Strategy
const strategy_api = new jwtStrategy(opts, async (payload, done) => {
	console.log('payload received: ', payload)
	try {
		const user = await User.findById(payload.sub)
		if (!user) return done(null, false, { message: 'The user could not be found' })
		done(null, user)
	}
	catch(err) {
		done(err, false)
	}
})

// Local Strategy
const strategy_local = new localStrategy({
	usernameField: 'email',
	passwordField: 'hash'
}, async (email, hash, done) => {
	try {
		const user = await User.findOne({ email })
		if (!user) return done(null, false)
		const validHash = await user.verifyHash(hash)
		if (!validHash) return done(null, false)
		done(null, user)
	}
	catch(err) {
		done(err, false)
	}
})

passport.use(strategy_api)
passport.use(strategy_local)

//=-=======================================
// EXPORTS
//=-=======================================
export default passport