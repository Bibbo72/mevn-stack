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
import joi from 'joi'

//=-=======================================
// EXPORTS
//=-=======================================
export default {
	validate: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.body, schema)
			if (result.error) return res.status(400).json(result.error)
			if (!req.value) { req.value = {} }
			req.value['body'] = result.value
			next()
		}
	},

	schemas: {
		registerSchema: joi.object().keys({
			username: joi.string().alphanum().min(4).max(16).required(),
			email: joi.string().email().required(),
			hash: joi.string().regex(/^[a-zA-Z0-9]{8,32}$/).required()
		}),

		loginSchema: joi.object().keys({
			email: joi.string().email().required(),
			hash: joi.string().regex(/^[a-zA-Z0-9]{8,32}$/).required()
		})
	}
}