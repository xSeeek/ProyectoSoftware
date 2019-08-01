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

const SocketIO = require('socket.io');
const io = SocketIO(server);

console.log('Starting socket server...');
io.on('connection', function(socket){
    console.log('Client ' + socket.id + ' connected.');

    socket.on('newNoticia', (newNoticia) => {
        socket.broadcast.emit('newNoticia', newNoticia);
    });

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log('Client ' + socket.id + ' disconnected.');
    });
});