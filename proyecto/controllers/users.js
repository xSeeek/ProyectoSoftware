const User = require('../models').Usuario;

const { validate, clean, format } = require('rut.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
    list(req, res)
    {
        return User
            .findAll()
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({message:'No hay usuarios en el sistema'}));
    },
    create(req, res)
    {
        return User
            .create({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, salt),
                nombre: req.body.nombre,
                a_paterno: req.body.a_paterno,
                a_materno: req.body.a_materno,
                rut: (function () {
                    var rut = req.body.rut;
                    if(validate(rut))
                    {
                        rut = format(rut)
                        return rut;
                    }
                    return null;
                  })(),
                telefono: req.body.telefono,
                codigoColaborador: req.body.codigoColaborador,
                rolUsuario: req.body.rolUsuario
            })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({message:'Error al agregar al usuario', error}));
    }
};