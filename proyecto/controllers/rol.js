const Rol = require('../models').Rol;
const Usuario =  require('../models').Usuario;

module.exports = {
    list(req, res)
    {
        return Rol
            .findAll()
            .then(rol => res.status(200).send(rol))
            .catch(error => res.status(400).send({message:'No hay roles registrados en el sistema'}));
    },
    create(req, res)
    {
        return Rol
            .create({
                tipo: req.body.tipo,
                descripcion: req.body.descripcion,
                nivel_p: req.body.nivel_p
            })
            .then(rol => res.status(200).send(rol))
            .catch(error => res.status(400).send({message:'Error al agregar el rol', error}));
    },
    edit(req, res)
    {
        return Rol
            .findByPk(req.body.idRol)
            .then(rol => {
                if(!rol)
                    return res.status(400).send({message:'Rol no existe en el sistema'});

                return rol
                .update({
                    tipo: req.body.tipo || rol.tipo,
                    descripcion: req.body.descripcion || rol.descripcion,
                    nivel_p: req.body.nivel_p || rol.nivel_p
                })
                .then(updatedRol => res.status(200).send(updatedRol))
                .catch(error => res.status(400).send(error));
            })
    },
    retrieve(req, res)
    {
        return Rol
            .findAll({
                where: {
                    idRol: req.body.idRol
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
            .then(rol => {
                console.log(rol);
                if(!rol)
                    return res.status(400).send({message:'Rol no encontrado o no existe'});
                return res.status(200).send(rol);
            })
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res)
    {
        return Rol
            .findByPk(req.body.idRol)
            .then(rol => {
                if(!rol)
                    return res.status(404).send({message: 'Rol no encontrado'});
                return rol
                    .destroy()
                    .then(() => res.status(200).send({message: 'Rol eliminado del sistema'}))
            })
            .catch(error => res.status(400).send(error));
    },
    changeStatus(req, res)
    {
        return Rol
            .findByPk(req.body.idRol)
            .then(rol => {
                if(!rol){
                    return res.status(400).send({message:'Rol no existe en el sistema'});
                }
                var newStatus = 0;
                if(rol.estado == 0)
                    newStatus = 1;
                return rol
                .update({
                    estado: newStatus,
                })
                .then(updatedStatus => res.status(200).send('Estado actualizado'))
                .catch(error => res.status(400).send(error));
            })
    }
};