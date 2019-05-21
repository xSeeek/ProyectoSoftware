const User = require('../models').Usuario;

const { validate, clean, format } = require('rut.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        var salt = bcrypt.genSaltSync(saltRounds);
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
    },
    retrieve(req, res)
    {

    },
    validate(req, res)
    {
        var email, password;

        email = req.body.email;
        password = req.body.password;

        User.findAll({
            where: {
                email: email
                },
                raw: true,
            })
            .then(function(usuario){
                console.log('Password envidada: ' + password + "\nPassword almacenada: " + usuario[0].password);
                if(password == null)
                    throw('Password no definida');
                if(bcrypt.compareSync(password, usuario[0].password))
                    return true;
                return false;
            })
            .then(status => res.status(200).send(status))
            .catch(error => res.status(400).send({message:'Datos insuficientes para realizar la validacion'}));;
    }
};