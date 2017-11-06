export default {
	env: process.env.NODE_ENV || 'development',
	debug: process.env.DEBUG || 'false',
	port: process.env.PORT || 3000,
	host: process.env.HOST || '127.0.0.1',
	secret: process.env.SECRET || 'nW67713n!gqE',
	database: 'mongodb://mevndocker_database_1:27017/jackievn',
	cache: '',
	mail: '',
	timezone: '',
	locale: ''
}