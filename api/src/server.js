//=-=======================================
// IMPORTS && CONSTANTS
//=-=======================================
// NPM Imports

// Local Imports
import app from './config/express'
import config from './config/env'
import database from './database'

//=-=======================================
// START SERVER
//=-=======================================
if (!module.parent) app.listen(config.port, () => console.log(`server is running on http://localhost:${config.port}`))

//=-=======================================
// EXPORTS
//=-=======================================
export default app