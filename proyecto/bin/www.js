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
const cors = require("cors");
app.use(cors());

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(process.env.PORT);



//socket IO settings
const SocketIO = require('socket.io');
const io = SocketIO(server);



io.on('connection', (socket) => {
    console.log('user connected');

        socket.on('new-message', (message) => {
            io.emit(message);
          });


  
});