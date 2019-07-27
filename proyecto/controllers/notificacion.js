const io = require('socket.io-client');

const Notificacion = require('../models').Notificacion;
const User = require('../models').Usuario;

module.exports = {
    createNoticia(newNoticia)
    {
        Notificacion.create({
            estado: 0,
            titulo:'¡Se ha publicado una nueva noticia!',
            descripcion: '¡Haz click para ver el nuevo contenido!'
        }).then(newNotificacion => {
            var socket = io.connect("http://localhost:3000", {
                reconnection: true
            });
            socket.on('connect', function () {
                console.log('Notification Controller (ClientID: ' + socket.id + ') -> Mensaje enviado al servidor: ');
                socket.emit('newNoticia', {id: newNoticia.idNoticia, titulo: newNotificacion.titulo, descripcion: newNotificacion.descripcion});
                console.log("ClientID: " + socket.id + " Envia -> Notificacion emitida");
            });
        });
    },
    createBeneficio(newBeneficio)
    {
        Notificacion.create({
            estado: 0,
            titulo:'¡Se ha publicado un nuevo beneficio!',
            descripcion: '¡Haz click para ver el nuevo contenido!'
        })
    }
};