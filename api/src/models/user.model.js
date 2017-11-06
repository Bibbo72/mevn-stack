//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

//=-=======================================
// DATABASE SCHEMA
//=-=======================================
const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	hash: { type: String, required: true },
	role: { type: String, enum: ['ROLE_ADMIN', 'ROLE_USER'], default: 'ROLE_USER' },
	resetPasswordToken: {type: String},
	resetPasswordExpires: { type: Date }
},
{
	timestamps: true
})

//=-=======================================
// PRE
//=-=======================================
UserSchema.pre('save', async function(next) {
	try {
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(this.hash, salt)
		this.hash = hash
		next()
	}
	catch(err) {
		next(err)
	}
})

UserSchema.pre('findOneAndUpdate', async function(next) {
	try {
		if (this._update.hash) {
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(this._update.hash, salt)

			this._update.hash = hash
		}
		next()
	}
	catch(err) {
		next(err)
	}
})

//=-=======================================
// SERVICES / METHODS
//=-=======================================
UserSchema.methods.verifyHash = async function(password) {
	try {
		return await bcrypt.compare(password, this.hash)
	}
	catch(err) {
		throw new Error(err)
	}
}

//=-=======================================
// EXPORTS
//=-=======================================
const user = mongoose.model('User', UserSchema)

export default user