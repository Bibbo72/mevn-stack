import chai from 'chai'
import chaiHttp from 'chai-http'
import api from '../src/server'

const should = chai.should()

chai.use(chaiHttp)

const username = 'mochatest'
const email = 'mochatest@test.com'
const hash = 'cleartextpassword'
const uuid = '7777-7777-7777-7777'

//=-=======================================
// USERS TESTING
//=-=======================================
describe('USER SUCCESS', () => {
	it('should return all users from the database.', (done) => {
		chai.request(api)
			.get('/api/users')
			.end((err, res) => {
				res.should.have.status(200)
				res.should.be.json
				res.body.should.be.a('array')
				done()
			})
	})

	it('should create a new user and save it to the database', (done) => {
		chai.request(api)
			.post('/api/users')
			.send({'username': username, 'email': email, 'hash': hash, 'uuid': uuid})
			.end((err, res) => {
				res.should.have.status(201)
				res.should.be.json
				res.body.should.be.a('object')
				res.body.should.have.property('username')
				res.body.should.have.property('email')
				res.body.should.have.property('createdAt')
				res.body.should.have.property('updatedAt')
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
				done()
			})
	})

	it('should update the new users credentials', (done) => {
		chai.request(api)
			.put(`/api/users/${username}`)
			.send({'email': 'lattetest@test.com'})
			.end((err, res) => {
				res.should.have.status(204)
				done()
			})
	})

	it('should delete the user that was created', (done) => {
		chai.request(api)
			.delete(`/api/users/${username}`)
			.end((err, res) => {
				res.should.have.status(204)
				done()
			})
	})

})