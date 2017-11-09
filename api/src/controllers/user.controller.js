//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import User from '../models/user.model'

//=-=======================================
// EXPORT: HTTP METHODS
//=-=======================================
export default {

	/**
	 * INDEX
	 * @return { obj } [returns all users]
	 */
	index: async (req, res, next) => {
		try {
			const users = await User.find({}, '-_id username email updatedAt createdAt uuid')
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
			const user = await User.findOne({username: req.params.username}, '-_id username email updatedAt createdAt')
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
			const user = new User(req.body)
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
			const user = await User.findOneAndUpdate({username: req.params.username}, req.body, {new: true})
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
			await User.remove({username: req.params.username})
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
}