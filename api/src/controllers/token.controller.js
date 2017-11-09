//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import Token from '../models/token.model'

//=-=======================================
// EXPORT
//=-=======================================
export default {
	/**
	 * GET ACTIVE JWTS
	 */
	index: async(req, res, next) => {
		try {
			const tokens = await Token.find({}, '-_id token uuid valid blacklist')
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
			const tokens = await Token.find({blacklist: true}, '-_id token uuid valid blacklist')
			res.status(200).json({ tokens })
		}
		catch(err) {
			next(err)
		}
	}
}