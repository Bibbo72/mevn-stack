/**
 * ENVIRONMENT CONFIG
 *
 * This file contains your environment variables.
 * For now, you'll have to define your own .ENV file
 * until a production default is made available.
 * 
 */
export default {
	env: process.env.NODE_ENV || 'development',
	debug: process.env.DEBUG || 'false',
	port: process.env.PORT || 3000,
	host: process.env.HOST || '127.0.0.1',
	secret: process.env.SECRET || 'nW67713n!gqE',
	database: process.env.DATABASE_SERVER || 'mevn_db/jackievn',
	cache: process.env.CACHE_SERVER || 'mevn_cs',
	mail: process.env.MAIL_SERVER || '',
	timezone: process.env.TIMEZONE || '',
	locale: process.env.LOCALE || 'en'
}