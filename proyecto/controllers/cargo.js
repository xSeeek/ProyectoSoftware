const Cargo = require('../models').Cargo;

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
    }
};