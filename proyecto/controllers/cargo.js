const Cargo = require('../models').Cargo;
const Usuario = require('../models').Usuario;

module.exports = {
    list(req, res)
    {
        return Cargo
            .findAll()
            .then(cargo => res.status(process.env.CRG_OK).send(cargo))
            .catch(error => res.status(process.env.CRG_NFD).send({message:'No hay cargos registrados en el sistema'}));
    },
    create(req, res)
    {
        return Cargo
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
            })
            .then(cargo => res.status(process.env.CRG_OK).send(cargo))
            .catch(error => res.status(process.env.CRG_ERR).send({message:'Error al agregar el area', error}));
    },
    edit(req, res)
    {
        return Cargo
            .findByPk(req.body.idCargo)
            .then(cargo => {
                if(!cargo)
                    return res.status(process.env.CRG_NFD).send({message:'Cargo no existe en el sistema'});

                return cargo
                .update({
                    nombre: req.body.nombre || area.nombre,
                    descripcion: req.body.descripcion || area.descripcion,
                })
                .then(updatedCargo => res.status(process.env.CRG_OK).send(updatedCargo))
                .catch(error => res.status(process.env.CRG_ERR).send(error));
            })
    },
    retrieve(req, res)
    {
        return Cargo
            .findAll({
                where: {
                    idCargo: req.body.idCargo
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
            .then(cargo => {
                console.log(cargo);
                if(!cargo)
                    return res.status(process.env.CRG_NFD).send({message:'Cargo no encontrado o no existe'});
                return res.status(process.env.CRG_OK).send(cargo);
            })
            .catch(error => res.status(process.env.CRG_ERR).send(error));
    },
    destroy(req, res)
    {
        return Cargo
            .findByPk(req.body.idCargo)
            .then(cargo => {
                if(!cargo)
                    return res.status(process.env.CRG_NFD).send({message: 'Cargo no encontrado'});
                return cargo
                    .destroy()
                    .then(() => res.status(process.env.CRG_OK).send({message: 'Cargo eliminado del sistema'}))
            })
            .catch(error => res.status(process.env.CRG_ERR).send(error));
    },
    changeStatus(req, res)
    {
        return Cargo
            .findByPk(req.body.idCargo)
            .then(cargo => {
                if(!cargo){
                    return res.status(process.env.CRG_NFD).send({message:'Cargo no existe en el sistema'});
                }
                var newStatus = 0;
                if(cargo.estado == 0)
                    newStatus = 1;
                return cargo
                .update({
                    estado: newStatus,
                })
                .then(updatedStatus => res.status(process.env.CRG_OK).send('Estado actualizado'))
                .catch(error => res.status(process.env.CRG_ERR).send(error));
            })
    }
};