import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'
import api from '../src/server'

const should = chai.should()

chai.use(chaiHttp)

const username = 'mochaadmin'
const email = 'mocha-admin@test.com'
const hash = 'cleartextpassword'
let token, uuid

//=-=======================================
// AUTHENTICATION TESTING
//=-=======================================
describe('AUTHENTICATION SUCCESS', () => {
	it('should be able to register a new user', (done) => {
		chai.request(api)
			.post('/api/auth/register')
			.send({ email, username, hash })
			.end((err, res) => {
				res.should.have.status(201)
				res.should.be.json
				res.body.should.be.a('object')
				res.body.should.have.property('token')
				token = res.body.token
				done()
			})
	})

	it('should be able to log in with the user that was created', (done) => {
		chai.request(api)
			.post('/api/auth/login')
			.send({ email, hash })
			.end((err, res) => {
				res.should.have.status(200)
				res.should.be.json
				res.body.should.be.a('object')
				res.body.should.have.property('token')
				done()
			})
	})

	it('should return the user that was just created', (done) => {
		chai.request(api)
			.get(`/api/users/${username}`)
			.end((err, res) => {
				res.should.have.status(200)
				res.should.be.json
				res.body.should.be.a('object')
				res.body.should.have.property('username')
				res.body.should.have.property('email')
				res.body.should.have.property('createdAt')
				res.body.should.have.property('updatedAt')
				done()
			})
	})

	it('should be able to access a protected resource', (done) => {
		chai.request(api)
			.get('/api/protected')
			.set('Authorization', token)
			.end((err, res) => {
				res.should.have.status(200)
				done()
			})
	})

	// it('should be able to request a refresh token after the access token expires', (done) => {
	// 	//
	// })

	it('should logout the user and destroy the token', (done) => {
		chai.request(api)
			.delete(`/api/auth/logout`)
			.set('Authorization', token)
			.end((err, res) => {
				res.should.have.status(204)
				done()
			})
	})

	it('should unregister the user and destroy their tokens', (done) => {
		chai.request(api)
			.delete(`/api/auth/unregister`)
			.set('Authorization', token)
			.send({ email, hash })
			.end((err, res) => {
				res.should.have.status(204)
				done()
			})
	})

})