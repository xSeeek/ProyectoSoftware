const Noticia = require('../models').Noticia;
const Area = require('../models').Area;
const fnNoticiasController = require('./FnNoticias');

const notificationController = require('./notificacion');

module.exports = {
    list(req, res)
    {   
        return Noticia
            .findAll()
            .then(noticia => res.status(process.env.NTC_OK).send(noticia))
            .catch(error => res.status(process.env.NTC_NFD).send({message:'No hay Noticias registradas en el sistema'}));
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
                photo: req.body.photo,
                fechaFin: (function () {
                    var finalDate = new Date();
                    var duracion = parseInt(req.body.duracion);
                    finalDate.setDate(finalDate.getDate() + duracion);
                    return finalDate;
                })(), 
            })
            .then(async noticia => {
                notificationController.createNoticia(noticia);


                var statusAssignate = {
                    "assignateArea"  :  await fnNoticiasController.assignateArea(noticia.idNoticia, req.body.newAreas)
                }
                return res.status(process.env.NTC_OK).send({message:'Noticia agregada correctamente', assignateStatus: statusAssignate, idNoticia: noticia.idNoticia});
             });
             

    },
    edit(req, res)
    {
        return Noticia
            .findByPk(req.body.idNoticia)
            .then(noticia => {
                if(!noticia){
                    return res.status(process.env.NTC_NFD).send({message:'Noticia no existe en el sistema'});
                }
                return noticia
                .update({
                    titulo: req.body.titulo || noticia.titulo,
                    descripcion: req.body.descripcion || noticia.descripcion,
                    duracion: req.body.duracion || noticia.duracion
                })
                .then(async updatedNoticia => {
                    var statusAssignate = {
                        "assignateArea"  :  fnNoticiasController.assignateArea(noticia.idNoticia, req.body.newAreas),
                        "unassignateArea"   :  fnNoticiasController.unassignateArea(updatedNoticia.idNoticia, req.body.oldAreas)
                    }
                    return res.status(process.env.NTC_OK).send({noticia: updatedNoticia, assignateStatus: statusAssignate});
                })
                .catch(error => res.status(process.env.NTC_ERR).send(error));
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
                        as: 'Areas',
                    }
                ],
                plain : true
            })
            .then(noticia => {
                console.log(noticia);
                if(!noticia)
                    return res.status(process.env.NTC_NFD).send({message:'Noticia no encontrada o no existe'});
                return res.status(process.env.NTC_OK).send(noticia);
            })
            .catch(error => res.status(process.env.NTC_ERR).send(error));
    },
    destroy(req, res)
    {
        return Noticia
            .findByPk(req.body.idNoticia)
            .then(noticia => {
                if(!noticia)
                    return res.status(process.env.NTC_NFD).send({message: 'Noticia no encontrada'});
                return noticia
                    .destroy()
                    .then(() => res.status(process.env.NTC_OK).send({message: 'Noticia eliminada del sistema'}))
            })
            .catch(error => res.status(process.env.NTC_ERR).send(error));
    },
    changeStatus(req, res)
    {
        return Noticia
            .findByPk(req.body.idNoticia)
            .then(noticia => {
                if(!noticia){
                    return res.status(process.env.NTC_NFD).send({message:'Noticia no existe en el sistema'});
                }
                var newStatus = 0;
                if(noticia.estado == 0)
                    newStatus = 1;
                return noticia
                .update({
                    estado: newStatus,
                })
                .then(updatedStatus => res.status(process.env.NTC_OK).send({message: 'Estado Actualizado'}))
                .catch(error => res.status(process.env.NTC_ERR).send(error));
            })
    },
    uploadPhoto(req, res)
    {
        if(!req.files)
            return res.status(process.env.NTC_ERR).send({message: "La imagen no puede estar en blanco"});
        console.log(req.files);
        var filesNames = req.files.map(function(file){
            return file.filename;
        });
        
        var arrayImage = filesNames;
        res.status(process.env.NTC_OK).send({message: arrayImage});
    },
    lastNews(req, res)
    {
        return Noticia
            .findAll({
                limit : 5,
                order: [['createdAt', 'DESC']],
            })
            .then(noticia => {
                return res.status(process.env.NTC_OK).send(noticia);
            })
    },
    getImagesByIdNews(req,res)
    {
        return Noticia
            .findAll({
                where: {
                    idNoticia : req.body.idNoticia
                },
                attributes: ['photo']
            })
            .then(noticia => {
                if(!noticia)
                    return res.status(process.env.NTC_NFD).send({message:'Noticia no existe en el sistema'});
                return res.status(process.env.NTC_OK).send(noticia);
            })
    }
};