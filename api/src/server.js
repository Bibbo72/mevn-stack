//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports

// Local Imports
import app from './config/express'
import config from './config/env'
import database from './config/database'
import cache from './config/cache'

// import acl from './config/authorization'

//=-=======================================
// START SERVER
//=-=======================================
if (!module.parent) app.listen(config.port, () => console.log(`server is running on http://localhost:${config.port}`))

//=-=======================================
// EXPORTS
//=-=======================================
export default app