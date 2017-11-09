//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema

//=-=======================================
// DATABASE SCHEMA
//=-=======================================
const TokenSchema = new Schema({
	token: { type: String, required: true, unique: true },
	uuid: { type: String, required: true, unique: true },
	valid: { type: Boolean, required: true, default: false },
	blacklist: { type: Boolean, required: true, default: false }
},
{
	timestamps: true
})

//=-=======================================
// PRE
//=-=======================================

//=-=======================================
// METHODS
//=-=======================================

//=-=======================================
// EXPORTS
//=-=======================================
const token = mongoose.model('Token', TokenSchema)

export default token