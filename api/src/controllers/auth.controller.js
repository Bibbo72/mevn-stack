//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM imports
import express from 'express'
import jwt from 'jsonwebtoken'

// Local imports
import config from '../config/env'
import passport from '../config/passport'
import User from '../models/user.model'

// Constants
const router = express.Router()

//=-=======================================
// SIGN JSON WEB TOKEN
//=-=======================================
const signToken = (user) => {
	return jwt.sign({
		iss: '',
		sub: user.id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 10)
	}, config.secret)
}

//=-=======================================
// EXPORT: HTTP METHODS
//=-=======================================
export default {
	/**
	 * REGISTER API USER
	 * @return { token } [JSON Web Token]
	 */
	register: async (req, res, next) => {
		try {
			// assign values to req.value.body
			const { username, email, hash } = req.value.body

			// check duplicate user
			const duplicateUser = await User.findOne({ username })
			if (duplicateUser) { res.status(403).json({ error: 'Sorry, that username is already being used.' }) }

			// check duplicate email
			const duplicateEmail = await User.findOne({ email })
			if (duplicateEmail) { res.status(403).json({ error: 'That email address is already being used.' }) }

			// save the user to the database
			const user = new User({ username, email, hash })
			await user.save()

			// sign and respond with the token
			const token = `bearer ${ signToken(user) }`
			res.status(200).json({ token })
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
		// joi validation -> passport local strategy -> this

		// sign and respond with the token
		const token = `bearer ${ signToken(req.user) }`
		res.status(200).json({ token })
	}
}