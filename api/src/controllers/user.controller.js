//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import express from 'express'
import User from '../models/user.model'

const router = express.Router()

//=-=======================================
// EXPORT: HTTP METHODS
//=-=======================================
export default {
	/**
	 * INDEX
	 * @return { JSON Object } [returns all users]
	 */
	index: async (req, res, next) => {
		try {
			let users = await User.find({})
			res.status(200).json(users)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * GET
	 * @return { JSON Object } [returns a single user]
	 */
	get: async (req, res, next) => {
		try {
			let user = await User.find({username: req.params.username})
			res.status(200).json(user)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * POST
	 * @return {obj} [returns newly created user]
	 */
	post: async (req, res, next) => {
		try {
			let user = new User(req.body)
			await user.save()
			res.status(201).json(user)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * PUT
	 * @return {obj} [returns updated user]
	 */
	put: async (req, res, next) => {
		try {
			let user = await User.findOneAndUpdate({username: req.params.username}, req.body, {new: true})
			res.status(204).json({message: `Account information for user ${user.username} was updated`})
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * PUT
	 * @return {obj} [deletes user, returns success message]
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

	// DEVELOPMENT FUNCTIONS ONLY!!! REMOVE FOR PRODUCTION!!!
	/**
	 * INITIALIZE
	 * @return {obj} [creates a default administrator]
	 */
	init: async (req, res, next) => {
		try {
			let user = new User({
				username: 'admin',
				email: 'admin@admin.com',
				hash: 'admin',
				role: 'ROLE_ADMIN'
			})
			await user.save()
			res.status(201).json(user)
		}
		catch(err) {
			next(err)
		}
	},

	/**
	 * PURGE
	 * @return {obj} [deletes all users from the database]
	 */
	purge: async (req, res, next) => {
		try {
			await User.deleteMany({})
			res.json({ message: 'The Users collection was purged. Hope you meant to do that... #monkas' })
		}
		catch(err) {
			next(err)
		}
	}
}