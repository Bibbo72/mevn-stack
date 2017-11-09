/**
 * CACHE INSTANCE CONFIGURATION
 *
 * CURRENTLY UNDER CONSTRUCTION
 *
 * As you've noticed with the project, it comes with a 
 * cs (cache server) directory containing the volumes for
 * a Redis server. Redis in this project will have the
 * following features:
 *
 * * Cache index routes for models
 * * Cache JWTs
 * * Configured as a LRU cache
 *
 * This feature will be rolled out when a production
 * configuration is implemented, as you won't really
 * need to cache anything until then.
 *
 * In case you decide to work with Redis in this project,
 * you can import the redis client instance into any other
 * file to use node-redis functions. 
 */

//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
import redis from 'redis'
import config from './env'

//=-=======================================
// CACHE SERVER CONNECT
//=-=======================================
const client = redis.createClient({ host: config.cache })

client.on('error', (err) => {
	console.log(`unable to connect to cache server: ${config.cache}:6379`)
	console.log(err)
})

client.on('ready', () => {
	console.log(`connected to cache server: ${config.cache}:6379`)
})

export default client