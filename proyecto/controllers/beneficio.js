const Beneficio = require('../models').Beneficio;
const Area = require('../models').Area;


module.exports = {
    list(req, res)
    {   
        return Beneficio
            .findAll()
            .then(beneficio => res.status(200).send(beneficio))
            .catch(error => res.status(400).send({message:'No hay beneficios registrados en el sistema'}));
    },
    create(req, res)
    {
        return Beneficio
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
            .then(beneficio => res.status(200).send({message:'Beneficio agregado correctamente'}))
            .catch(error => res.status(400).send({message:'Error al agregar beneficio', error}));
    },
    edit(req, res)
    {
        return Beneficio
            .findByPk(req.body.idBeneficio)
            .then(beneficio => {
                if(!beneficio){
                    return res.status(400).send({message:'Beneficio no existe en el sistema'});
                }
                return beneficio
                .update({
                    titulo: req.body.titulo || beneficio.titulo,
                    descripcion: req.body.descripcion || beneficio.descripcion,
                    duracion: req.body.duracion || beneficio.duracion
                })
                .then(updatedBeneficio => res.status(200).send(updatedBeneficio))
                .catch(error => res.status(400).send(error));
            })
    },
    retrieve(req, res)
    {
        return Beneficio
            .findAll({
                where: {
                    idBeneficio: req.body.idBeneficio
                },
                include: [
                    {
                        model: Area,
                        as: 'Áreas',
                    }
                ],
                plain : true
            })
            .then(beneficio => {
                console.log(beneficio);
                if(!beneficio)
                    return res.status(400).send({message:'Beneficio no encontrado o no existe'});
                return res.status(200).send(beneficio);
            })
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res)
    {
        return Beneficio
            .findByPk(req.body.idBeneficio)
            .then(beneficio => {
                if(!beneficio)
                    return res.status(404).send({message: 'Beneficio no encontrado'});
                return beneficio
                    .destroy()
                    .then(() => res.status(200).send({message: 'Beneficio eliminado del sistema'}))
            })
            .catch(error => res.status(400).send(error));
    },
    changeStatus(req, res)
    {
        return Beneficio
            .findByPk(req.body.idBeneficio)
            .then(beneficio => {
                if(!beneficio){
                    return res.status(400).send({message:'Beneficio no existe en el sistema'});
                }
                var newStatus = 0;
                if(beneficio.estado == 0)
                    newStatus = 1;
                return beneficio
                .update({
                    estado: newStatus,
                })
                .then(updatedStatus => res.status(200).send({message: 'Estado Actualizado'}))
                .catch(error => res.status(400).send(error));
            })
    }
};