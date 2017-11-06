import joi from 'joi'

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
			username: joi.string().required(),
			email: joi.string().email().required(),
			hash: joi.string().required()
		}),

		loginSchema: joi.object().keys({
			email: joi.string().email().required(),
			hash: joi.string().required()
		})
	}
}