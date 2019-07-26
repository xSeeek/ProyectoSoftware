const Noticia = require('../models').Noticia;
const Area = require('../models').Area;
const Notificacion = require('../models').Notificacion;

const io = require('socket.io-client');

module.exports = {
    list(req, res)
    {   
        return Noticia
            .findAll()
            .then(noticia => res.status(200).send(noticia))
            .catch(error => res.status(400).send({message:'No hay Noticias registradas en el sistema'}));
    },
    create(req, res)
    {
        return Noticia
            .create({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                fechaInicio: (function () { 
                    var today = new Date();
                    return today;
                })(),
                duracion: req.body.duracion,
                fechaFin: (function () {
                    var finalDate = new Date();
                    var duracion = parseInt(req.body.duracion);
                    finalDate.setDate(finalDate.getDate() + duracion);
                    return finalDate;
                })(), 
            })
            .then(notification => {
                Notificacion.create({
                    estado: 0,
                    titulo:'¡Se ha publicado una nueva noticia!',
                    descripcion: '¡Haz click para ver el nuevo contenido!'
                });

                var socket = io.connect("http://localhost:3000", {
                    reconnection: true
                });
                socket.on('connect', function () {
                    console.log('Connected to localhost:3000');

                    socket.emit('newNoticia', {message: "hola"})
                    console.log("Notificacion emitida");
                });
             } )
            .then(noticia => res.status(200).send({message:'Noticia agregada correctamente'}))
    },
    edit(req, res)
    {
        return Noticia
            .findByPk(req.body.idNoticia)
            .then(noticia => {
                if(!noticia){
                    return res.status(400).send({message:'Noticia no existe en el sistema'});
                }
                return noticia
                .update({
                    titulo: req.body.titulo || noticia.titulo,
                    descripcion: req.body.descripcion || noticia.descripcion,
                    duracion: req.body.duracion || noticia.duracion
                })
                .then(updatedNoticia => res.status(200).send(updatedNoticia))
                .catch(error => res.status(400).send(error));
            })
    },
    retrieve(req, res)
    {
        return Noticia
            .findAll({
                where: {
                    idNoticia: req.body.idNoticia
                },
                include: [
                    {
                        model: Area,
                        as: 'Noticias',
                    }
                ],
                plain : true
            })
            .then(noticia => {
                console.log(noticia);
                if(!noticia)
                    return res.status(400).send({message:'Noticia no encontrada o no existe'});
                return res.status(200).send(noticia);
            })
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res)
    {
        return Noticia
            .findByPk(req.body.idNoticia)
            .then(noticia => {
                if(!noticia)
                    return res.status(404).send({message: 'Noticia no encontrada'});
                return noticia
                    .destroy()
                    .then(() => res.status(200).send({message: 'Noticia eliminada del sistema'}))
            })
            .catch(error => res.status(400).send(error));
    },
    changeStatus(req, res)
    {
        return Noticia
            .findByPk(req.body.idNoticia)
            .then(noticia => {
                if(!noticia){
                    return res.status(400).send({message:'Noticia no existe en el sistema'});
                }
                var newStatus = 0;
                if(noticia.estado == 0)
                    newStatus = 1;
                return noticia
                .update({
                    estado: newStatus,
                })
                .then(updatedStatus => res.status(200).send({message: 'Estado Actualizado'}))
                .catch(error => res.status(400).send(error));
            })
    }
};