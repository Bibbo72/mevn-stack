//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM imports
import jwt from 'jsonwebtoken'
import uuidv4 from 'uuid/v4'

// Local imports
import config from '../config/env'
import User from '../models/user.model'
import Token from '../models/token.model'

//=-=======================================
// HELPER METHODS
//=-=======================================
const signToken = (user) => {
	return jwt.sign({
		iss: '',
		sub: user.id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 1)
	}, config.secret)
}

const saveToken = async (token, uuid) => {
	const accessToken = await new Token({ token, uuid, valid: true })
	return await accessToken.save()
}

//=-=======================================
// EXPORT
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
			if (duplicateUser) { return res.status(403).json({ error: 'Sorry, that username is already being used.' }) }

			// check duplicate email
			const duplicateEmail = await User.findOne({ email })
			if (duplicateEmail) { return res.status(403).json({ error: 'That email address is already being used.' }) }

			// generate a random UUID
			const uuid = uuidv4()

			// save the user to the database
			const user = new User({ username, email, hash, uuid })
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
			const user = await User.findOne({uuid})

			// get token from headers
			const token = req.get('Authorization')

			// find tokens with user.uuid and destroy them
			// 
			// NOTE: although users should only have one active token at a time,
			// this makes sure that all leftover expired tokens and/or maliciously
			// forged tokens are purged from the database. If your database gets
			// too big, you may need to implement a more scalable solution for
			// performance.
			await Token.deleteMany({uuid})

			// find and destroy the user by email and uuid
			await User.remove({email, uuid})
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
		const activeToken = await Token.findOne({uuid})
		if (activeToken) await Token.remove({uuid})

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
			await Token.remove({ token })
			res.status(204).json({ message: `We've destroyed your access token. Please login to obtain another.` })
		}
		catch(err) {
			next(err)
		}
	}
}