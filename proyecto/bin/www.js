/**
 * Import .env
 */
require('dotenv').config();

/**
 * Import internal Module dependencies.
 */
const auth = require('../middlewares/auth');
const app = require('../app');
const debug = require('debug')('proyecto:server');
const http = require('http');



/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(process.env.PORT);




