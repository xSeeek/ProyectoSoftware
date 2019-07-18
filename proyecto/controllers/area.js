const Area = require('../models').Area;
const Usuario = require('../models').Usuario;

module.exports = {
    list(req, res)
    {
        return Area
            .findAll()
            .then(area => res.status(process.env.ARE_OK).send(area))
            .catch(error => res.status(process.env.ARE_NFD).send({message:'No hay areas registradas en el sistema'}));
    },
    create(req, res)
    {
        return Area
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
            })
            .then(area => res.status(process.env.ARE_OK).send(area))
            .catch(error => res.status(process.env.ARE_ERR).send({message:'Error al agregar el Area', error}));
    },
    edit(req, res)
    {
        return Area
            .findByPk(req.body.idArea)
            .then(area => {
                if(!area)
                    return res.status(process.env.ARE_NFD).send({message:'Area no existe en el sistema'});

                return area
                .update({
                    nombre: req.body.nombre || area.nombre,
                    descripcion: req.body.descripcion || area.descripcion,
                })
                .then(updatedArea => res.status(process.env.ARE_OK).send(updatedArea))
                .catch(error => res.status(process.env.ARE_ERR).send(error));
            })
    },
    retrieve(req, res)
    {
        return Area
            .findAll({
                where: {
                    idArea: req.body.idArea
                },
                include: [
                    {
                        model: Usuario,
                        as: 'Usuarios',
                        attributes: {
                            exclude: ['password', 'validate_token', 'validate_token_expires']
                        }
                    }
                ],
                plain : true
            })
            .then(area => {
                console.log(area);
                if(!area)
                    return res.status(process.env.ARE_NFD).send({message:'Area no encontrada o no existe'});
                return res.status(process.env.ARE_OK).send(area);
            })
            .catch(error => res.status(process.env.ARE_ERR).send(error));
    },
    destroy(req, res)
    {
        return Area
            .findByPk(req.body.idArea)
            .then(area => {
                if(!area)
                    return res.status(process.env.ARE_NFD).send({message: 'Area no encontrada'});
                return area
                    .destroy()
                    .then(() => res.status(process.env.ARE_OK).send({message: 'Area eliminada del sistema'}))
            })
            .catch(error => res.status(process.env.ARE_ERR).send(error));
    },
    changeStatus(req, res)
    {
        return Area
            .findByPk(req.body.idArea)
            .then(area => {
                if(!area){
                    return res.status(process.env.ARE_NFD).send({message:'Area no existe en el sistema'});
                }
                var newStatus = 0;
                if(area.estado == 0)
                    newStatus = 1;
                return area
                .update({
                    estado: newStatus,
                })
                .then(updatedStatus => res.status(process.env.ARE_OK).send({message: 'Estado Actualizado'}))
                .catch(error => res.status(process.env.ARE_ERR).send(error));
            })
    }
};