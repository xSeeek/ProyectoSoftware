const User = require('../models').Usuario;
const Rol = require('../models').Rol;
const Area = require('../models').Area;
const Cargo = require('../models').Cargo;

const services = require('../services');
const crypto = require('crypto-js');
const validator = require("email-validator");

const { validate, clean, format } = require('rut.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    list(req, res)
    {
        return User
            .findAll({
                attributes: {
                    exclude: ['password', 'validate_token', 'validate_token_expires']
                }
            })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({message:'No hay usuarios en el sistema'}));
    },
    create(req, res)
    {
        if(validator.validate(req.body.email) == false)
            return res.status(400).send({message:'El correo electrónico ingresado no es válido.'});

        var salt = bcrypt.genSaltSync(saltRounds);
        return User
            .create({
                email: req.body.email,
                nombre: req.body.nombre,
                password: bcrypt.hashSync(req.body.password, salt),
                a_paterno: req.body.a_paterno,
                a_materno: req.body.a_materno,
                rut: (function () {
                    var rut = req.body.rut;
                    if(validate(rut))
                    {
                        rut = format(rut);
                        console.log(rut);
                        return rut;
                    }
                    return res.status(500).send({message:'RUT ingresado no es válido'});
                  })(),
                telefono: req.body.telefono,
                fechaNacimiento: new Date(req.body.fechaNacimiento),
                codigoColaborador: req.body.codigoColaborador,
                rolUsuario: req.body.rolUsuario
            })
            .then(user => res.status(200).send({
                message: "Usuario creado correctamente"
            }))
            .catch(error => res.status(500).send({message:'Error al agregar al usuario', error}));
    },
    edit(req, res)
    {
        return User
            .findByPk(req.body.idUsuario, {
                attributes: {
                    exclude: ['password', 'validate_token', 'validate_token_expires']
                }
            })
            .then(user => {
                var estado = 1;
                var validate_token = null;

                if(!user)
                    return res.status(400).send({message:'Usuario no existe en el sistema'});
                if(req.body.password || req.body.rut || req.body.codigoColaborador || req.body.rolUsuario)
                    return res.status(400).send({message:'No se puede actualizar este dato mediante esta via'});
                
                User.findAll({
                    where:{
                        email: req.body.email
                    },
                    attributes: {
                        exclude: ['password', 'validate_token', 'validate_token_expires']
                    }
                })
                .then(find => {
                    if(find.length != 0)
                        return res.status(400).send({message:'El correo electrónico ingresado ya esta registrado en el sistema'});
                });

                var token = crypto.AES.encrypt(req.body.email, process.env.JWT_SECRET);

                if(req.body.email != null)
                {
                    if(validator.validate(req.body.email) == false)
                        return res.status(400).send({message:'El correo electrónico ingresado no es válido.'});

                    var estado = 2;
                    validate_token = token.toString();

                    var mailOptions = {
                        to: req.body.email,
                        subject: 'Validar nuevo correo electronico',
                        template: 'change_email',
                        context: {
                            url: process.env.FRONT_API + 'validateEmail?token=' + token.toString(),
                            name: user.nombre + ' ' + user.a_paterno + ' ' + user.a_materno,
                            token: token.toString()
                        }
                    };
                    services.email.sendEmail(mailOptions);
                }

                return user
                    .update({
                        nombre: req.body.nombre || user.nombre,
                        a_paterno: req.body.a_paterno || user.a_paterno,
                        a_materno: req.body.a_materno || user.a_materno,
                        telefono: req.body.telefono || user.telefono,
                        fechaNacimiento: req.body.fechaNacimiento || user.fechaNacimiento,
                        estado: estado,
                        validate_token: validate_token
                    })
                    .then(updatedUser => res.status(200).send(updatedUser))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    retrieve(req, res)
    {
        return User
            .findByPk(req.body.idUsuario, {
                attributes: {
                    exclude: ['password', 'validate_token', 'validate_token_expires']
                },
                include: [
                    {
                        model: Rol,
                        as: 'Rol',
                    },
                    {
                        model: Area,
                        as: 'Areas'
                    },
                    {
                        model: Cargo,
                        as: 'Cargos'
                    }
                ],
                plain : true
            })
            .then(usuario => {
                if((function () {
                    for(var key in usuario) {
                        if(usuario.hasOwnProperty(key))
                            return false;
                    }
                    return true;
                })()){
                    return res.status(404).send({
                        message: 'Usuario no encontrado'
                    })
                };
                return res.status(200).send(usuario);
            })
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res)
    {
        return User
            .findByPk(req.body.idUsuario)
            .then(usuario => {
                if(!usuario)
                    return res.status(404).send({message: 'Usuario no encontrado'});
                return usuario
                    .destroy()
                    .then(() => res.status(200).send({message: 'Usuario eliminado del sistema'}))
            })
            .catch(error => res.status(400).send(error));
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
                attributes: {
                    exclude: ['password', 'validate_token', 'validate_token_expires']
                },
                plain: true
            })
            .then(function(usuario){
                if(bcrypt.compareSync(password, usuario.password))
                    return res.status(200).send(true);
                return res.status(500).send(false);
            })
            .catch(error => res.status(400).send({message:'Datos insuficientes para realizar la validacion'}));;
    },
    confirmEmail(req, res)
    {
        if(req.body.token == null)
            return res.status(400).send({message:'Token no es válido'});

        return User
        .findAll({
            where: {
                validate_token: req.body.token
                },
                plain: true
        })
        .then(user => {
            var estado = 1;

            if(user == null)
                return res.status(400).send({message:'Token no es válido'});

            if(user.estado != 2)
                return res.status(400).send({message:'No ha solicitado un cambio de email recientemente'});

            var bytes  = crypto.AES.decrypt(req.body.token, process.env.JWT_SECRET);
            var email = bytes.toString(crypto.enc.Utf8);

            return user
                .update({
                    email: email,
                    estado: estado,
                    validate_token: null
                })
                .then(updatedUser => res.status(200).send(updatedUser))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }
};