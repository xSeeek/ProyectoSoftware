const Sequelize = require('sequelize');
const User = require('../models').Usuario;
const Rol = require('../models').Rol;
const Area = require('../models').Area;
const Cargo = require('../models').Cargo;

const services = require('../services');
const crypto = require('crypto-js');
const validator = require("email-validator");

const fnUsersController = require('./FnUsers');

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
            .then(user => {
                res.status(process.env.USR_OK).send(user)
            })
            .catch(error => res.status(process.env.USR_NFD).send({message:'No hay usuarios en el sistema'}));
    },
    listAllRelationships(req, res)
    {
        return User
            .findAll({
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
                ]
            })
            .then(user => res.status(process.env.USR_OK).send(user))
            .catch(error => res.status(process.env.USR_NFD).send({message:'No hay usuarios en el sistema'}));
    },
    create(req, res)
    {
        if(validator.validate(req.body.email) == false)
            return res.status(process.env.USR_EMAIL).send({message:'El correo electrónico ingresado no es válido.'});

        User.findAll({
            where: {
                    [(Sequelize.Op).or]: [{email: req.body.email}, {rut: format(req.body.rut)}]
                },
                plain: true
            })
            .then(usuario => {
                if(usuario != null && usuario.length != 0)
                {
                    if(usuario.email == req.body.email)
                        return res.status(process.env.USR_EMAIL).send({message:'Ya existe un usuario con el mismo email ingresado en el sistema'});
                    if(usuario.rut == format(req.body.rut))
                        return res.status(process.env.USR_RUT).send({message:'Ya existe un usuario con el mismo RUT ingresado en el sistema'});
                }
            });

        var token = crypto.AES.encrypt(req.body.email, process.env.JWT_SECRET);
        var validate_token = token.toString();

        var salt = bcrypt.genSaltSync(saltRounds);
        User
            .create({
                email: req.body.email,
                nombre: req.body.nombre,
                a_paterno: req.body.a_paterno,
                a_materno: req.body.a_materno,
                rut: (function () {
                    var rut = req.body.rut;
                    if(validate(rut))
                    {
                        rut = format(rut);
                        return rut;
                    }
                    return res.status(process.env.USR_RUT).send({message:'RUT ingresado no es válido'});
                  })(),
                telefono: req.body.telefono,
                fechaNacimiento: new Date(req.body.fechaNacimiento),
                codigoColaborador: req.body.codigoColaborador,
                estado: 2,
                rolUsuario: req.body.rolUsuario,
                profilePhoto: req.body.profilePhoto,
                coverPhoto: req.body.coverPhoto,
                validate_token: validate_token
            })
            .then(async user => {
                var mailOptions = {
                    to: req.body.email,
                    subject: 'Activar su cuenta de usuario',
                    template: 'activate_account',
                    context: {
                        url: process.env.FRONT_API + 'activateAccount?token=' + token.toString(),
                        name: user.nombre + ' ' + user.a_paterno + ' ' + user.a_materno,
                        token: token.toString()
                    }
                };
                services.email.sendEmail(mailOptions);

                var statusAssignate = {
                    "assignateCargo"    :   await fnUsersController.assignateCargo(user.idUsuario, req.body.newCargos),
                    "assignateArea"     :   await fnUsersController.assignateArea(user.idUsuario, req.body.newAreas)
                }
                return res.status(process.env.USR_OK).send({message:"Usuario creado correctamente", assignateStatus: statusAssignate, idUsuario: user.idUsuario});
            })
            .catch(error => res.status(process.env.USR_ERR).send({message:'Error al agregar al usuario', error}));
    },
    edit(req, res)
    {
        return User
            .findByPk(req.body.idUsuario, {
                attributes: {
                    exclude: ['password', 'validate_token_expires']
                }
            })
            .then(user => {
                var estado = 1;
                var validate_token = null;

                if(!user)
                    return res.status(process.env.USR_NFD).send({message:'Usuario no existe en el sistema'});
                if(req.body.password)
                    return res.status(process.env.USR_INV).send({message:'No se puede actualizar este dato mediante esta via'});

                if(req.body.email != undefined)
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
                            return res.status(process.env.USR_EMAIL).send({message:'El correo electrónico ingresado ya esta registrado en el sistema'});
                    });

                if(req.body.email != undefined)
                {
                    var token = crypto.AES.encrypt(req.body.email, process.env.JWT_SECRET);

                    if(validator.validate(req.body.email) == false)
                        return res.status(process.env.USR_EMAIL).send({message:'El correo electrónico ingresado no es válido.'});

                    estado = 2;
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
                        rut: req.body.rut || user.rut,
                        codigoColaborador: req.body.codigoColaborador || user.codigoColaborador,
                        rolUsuario: req.body.rolUsuario || user.rolUsuario,
                        telefono: req.body.telefono || user.telefono,
                        fechaNacimiento: (function(){
                            if(req.body.fechaNacimiento == null || req.body.fechaNacimiento == "")
                                return user.fechaNacimiento
                            return new Date(req.body.fechaNacimiento);
                            })(),
                        profilePhoto: req.body.profilePhoto || user.profilePhoto,
                        coverPhoto: req.body.coverPhoto || user.coverPhoto,
                        aboutMe: req.body.aboutUser || user.aboutMe,
                        estado: estado,
                        validate_token: validate_token
                    })
                    .then(async updatedUser => {
                        var statusAssignate = {
                            "assignateCargo"    :   fnUsersController.assignateCargo(updatedUser.idUsuario, req.body.newCargos),
                            "assignateArea"     :   fnUsersController.assignateArea(updatedUser.idUsuario, req.body.newAreas),
                            "unassignateCargo"  :   fnUsersController.unassignateCargo(updatedUser.idUsuario, req.body.oldCargos),
                            "unassignateArea"   :   fnUsersController.unassignateArea(updatedUser.idUsuario, req.body.oldAreas)
                        }
                        return res.status(process.env.USR_OK).send({user: updatedUser, assignateStatus: statusAssignate});
                    })
                    .catch(error => res.status(process.env.USR_ERR).send(error));
            })
            .catch(error => res.status(process.env.USR_ERR).send(error));
    },
    editUser(req, res)
    {
        return User
        .findByPk(req.body.idUsuario, {
            attributes: {
                exclude: ['password', 'validate_token_expires']
            }
        })
        .then(user => {
            var estado = 1;
            var validate_token = null;

            if(!user)
                return res.status(process.env.USR_NFD).send({message:'Usuario no existe en el sistema'});
            if(req.body.password || req.body.rut || req.body.codigoColaborador || req.body.rolUsuario)
                return res.status(process.env.USR_INV).send({message:'No se puede actualizar este dato mediante esta via'});

            if(req.body.email != undefined)
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
                        return res.status(process.env.USR_EMAIL).send({message:'El correo electrónico ingresado ya esta registrado en el sistema'});
                });

            if(req.body.email != undefined)
            {
                var token = crypto.AES.encrypt(req.body.email, process.env.JWT_SECRET);

                if(validator.validate(req.body.email) == false)
                    return res.status(process.env.USR_EMAIL).send({message:'El correo electrónico ingresado no es válido.'});

                estado = 2;
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
                    fechaNacimiento: (function(){
                        if(req.body.fechaNacimiento == null || req.body.fechaNacimiento == "")
                            return user.fechaNacimiento
                        return new Date(req.body.fechaNacimiento);
                        })(),
                    profilePhoto: req.body.profilePhoto || user.profilePhoto,
                    coverPhoto: req.body.coverPhoto || user.coverPhoto,
                    aboutMe: req.body.aboutUser || user.aboutMe,
                    validate_token: validate_token
                })
                .then(async updatedUser => {
                    return res.status(process.env.USR_OK).send({user: updatedUser});
                })
                .catch(error => res.status(process.env.USR_ERR).send(error));
        })
        .catch(error => res.status(process.env.USR_ERR).send(error));
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
                if(usuario == null)
                    return res.status(process.env.USR_NFD).send({message: 'Usuario no encontrado'});
                return res.status(process.env.USR_OK).send(usuario);
            })
            .catch(error => res.status(process.env.USR_ERR).send(error));
    },
    destroy(req, res)
    {
        return User
            .findByPk(req.body.idUsuario)
            .then(usuario => {
                if(!usuario)
                    return res.status(process.env.USR_NFD).send({message: 'Usuario no encontrado'});
                return usuario
                    .destroy()
                    .then(() => res.status(process.env.USR_OK).send({message: 'Usuario eliminado del sistema'}))
            })
            .catch(error => res.status(process.env.USR_ERR).send(error));
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
                    return res.status(process.env.USR_OK).send(true);
                return res.status(500).send(false);
            })
            .catch(error => res.status(process.env.USR_INS).send({message:'Datos insuficientes para realizar la validacion'}));;
    },
    confirmEmail(req, res)
    {
        if(req.body.token == null)
            return res.status(process.env.USR_TKN).send({message:'Token no es válido'});

        return User
        .findAll({
            where: {
                validate_token: req.body.token
                },
                attributes: {
                    exclude: ['password', 'validate_token', 'validate_token_expires']
                },
                plain: true
        })
        .then(user => {
            var estado = 1;

            if(user == null)
                return res.status(process.env.USR_TKN).send({message:'Token no es válido'});

            if(user.estado != 2)
                return res.status(process.env.USR_CHK).send({message:'No ha solicitado un cambio de email recientemente'});

            var bytes  = crypto.AES.decrypt(req.body.token, process.env.JWT_SECRET);
            var email = bytes.toString(crypto.enc.Utf8);

            return user
                .update({
                    email: email,
                    estado: estado,
                    validate_token: null
                })
                .then(updatedUser => res.status(process.env.USR_OK).send(updatedUser))
                .catch(error => res.status(process.env.USR_ERR).send(error));
        })
        .catch(error => res.status(process.env.USR_ERR).send(error));
    },
    changeStatus(req, res)
    {
        return User
            .findByPk(req.body.idUsuario)
            .then(usuario => {
                if(!usuario){
                    return res.status(process.env.USR_NFD).send({message:'Usuario no existe en el sistema'});
                }
                var newStatus = 0;
                if(usuario.estado == 0)
                    newStatus = 1;
                return usuario
                .update({
                    estado: newStatus,
                })
                .then(status => res.status(process.env.USR_OK).send({message: "Usuario Actualizado"}))
                .catch(error => res.status(process.env.USR_ERR).send(error));
            })
    },
    getContactos(req, res)
    {
        User
            .findByPk(req.body.idUsuario)
            .then(usuario => {
                usuario.getAreas()
                .then(async areasUsuario => {
                    var contacts = new Array();
                    var index = 0;

                    for(var i = 0; i < areasUsuario.length; i++)
                    {
                        var data = areasUsuario[i].getUsuarios().then(usuariosArea => {
                                    var searchNoUser = new Array();
                                    var indexUser = 0;
                                    for(var j = 0; j < usuariosArea.length; j++)
                                        if(usuariosArea[j].idUsuario != req.body.idUsuario)
                                        {
                                            var userData = {
                                                "idUsuario"     : usuariosArea[j].idUsuario,
                                                "nombre"        : usuariosArea[j].nombre,
                                                "a_paterno"     : usuariosArea[j].a_paterno,
                                                "a_materno"     : usuariosArea[j].a_materno,
                                                "profilePhoto"  : usuariosArea[j].profilePhoto,
                                                "coverPhoto"    : usuariosArea[j].coverPhoto,
                                                "aboutUser"     : usuariosArea[j].aboutMe
                                            };
                                            searchNoUser[indexUser] = userData;
                                            indexUser++;
                                        }
                                    return searchNoUser;
                                });
                        var newElement = {
                            "idArea"        : areasUsuario[i].idArea,
                            "nombreArea"    : areasUsuario[i].nombre,
                            "datosUsuarios" : await data
                        };
                        contacts[index] = newElement;
                        index++;
                    }
                    return res.status(process.env.USR_OK).send(contacts);
                })
            })
    },
    uploadPhoto(req, res)
    {
        if(!req.file)
            return res.status(process.env.USR_ERR).send({message: "La imagen no puede estar en blanco"});
        res.status(process.env.USR_OK).send({message: req.file.filename});
    }
};