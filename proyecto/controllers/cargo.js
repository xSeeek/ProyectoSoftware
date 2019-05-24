const Cargo = require('../models').Cargo;
const Usuario = require('../models').Usuario;

module.exports = {
    list(req, res)
    {
        return Cargo
            .findAll()
            .then(cargo => res.status(200).send(cargo))
            .catch(error => res.status(400).send({message:'No hay cargos registrados en el sistema'}));
    },
    create(req, res)
    {
        return Cargo
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
            })
            .then(cargo => res.status(200).send(cargo))
            .catch(error => res.status(400).send({message:'Error al agregar el area', error}));
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
                        as: 'Usuarios Cargo',
                        attributes: {
                            exclude: ['password']
                        }
                    }
                ],
                plain : true
            })
            .then(cargo => {
                console.log(cargo);
                return res.status(200).send(cargo);
            })
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res)
    {
        return Cargo
            .findByPk(req.body.idCargo)
            .then(cargo => {
                if(!cargo)
                    return res.status(404).send({message: 'Cargo no encontrado'});
                return cargo
                    .destroy()
                    .then(() => res.status(200).send({message: 'Cargo eliminado del sistema'}))
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res)
    {
        
    }
};