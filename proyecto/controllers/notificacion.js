const io = require('socket.io-client');
const Sequelize = require('sequelize');

const Notificacion = require('../models').Notificacion;
const User = require('../models').Usuario;

const usersController = require('./FnUsers');

module.exports = {
    createNoticia(newNoticia)
    {
        Notificacion.create({
            estado: 0,
            tipo: 'Noticia',
            titulo:'¡Se ha publicado una nueva noticia!',
            descripcion: '¡Haz click para ver el nuevo contenido!',
            idReferencia: newNoticia.idNoticia
        }).then(newNotificacion => {
            User.findAll()
            .then(usuarios => {
                usuarios.forEach(usuario => {
                    usersController.assignateNotification(usuario.idUsuario, newNotificacion.idNotificacion);
                });
                var socket = io.connect("http://localhost:3000", {
                    reconnection: true
                });
                socket.on('connect', function () {
                    socket.emit('newNoticia', 
                        {
                            idReferencia: newNoticia.idNoticia,
                            tipo: newNotificacion.tipo,
                            estado: newNotificacion.estado,
                            titulo: newNotificacion.titulo, 
                            descripcion: newNotificacion.descripcion
                        });
                    socket.disconnect();
                });
            })
        });
    },
    createBeneficio(newBeneficio)
    {
        Notificacion.create({
            estado: 0,
            tipo: 'Beneficio',
            titulo:'¡Se ha publicado un nuevo beneficio!',
            descripcion: '¡Haz click para ver el nuevo contenido!'
        })
    },
    retrieve(req, res)
    {
        User.findByPk(req.body.idUsuario, {
            include: [
                {
                    model: Notificacion,
                    as: 'Notificaciones',
                    where: {
                        [(Sequelize.Op).not]: [{estado: 2}]
                    }
                }
            ]
        }).then(usuario => {
            if(usuario == null)
                return res.status(process.env.USR_OK).send(null);
            return res.status(process.env.USR_OK).send(usuario.Notificaciones);
        })
    }
};