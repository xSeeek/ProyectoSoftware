const User = require('../models').Usuario;
const Rol = require('../models').Rol;
const Area = require('../models').Area;
const Cargo = require('../models').Cargo;

const { validate, clean, format } = require('rut.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    list(req, res)
    {
        return User
            .findAll({
                attributes: {
                    exclude: ['password']
                }
            })
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
                nombre: req.body.name,
                a_paterno: req.body.lastname_father,
                a_materno: req.body.lastname_mother,
                rut: (function () {
                    var rut = req.body.rut;
                    if(validate(rut))
                    {
                        rut = format(rut);
                        return rut;
                    }
                    return res.status(500).send({message:'RUT ingresado no es válido'});
                  })(),
                telefono: req.body.phone,
                codigoColaborador: req.body.contributerId,
                rolUsuario: req.body.rol
            })
            .then(user => res.status(200).send({
                message: "Usuario creado correctamente"
            }))
            .catch(error => res.status(500).send({message:'Error al agregar al usuario', error}));
    },
    retrieve(req, res)
    {
        return User
            .findAll({
                where: {
                    email: req.body.emailUsuario
                },
                attributes: {
                    exclude: ['password']
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
                console.log(usuario.rut)
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
                plain: true
            })
            .then(function(usuario){
                console.log('Password envidada: ' + password + "\nPassword almacenada: " + usuario.password);
                if(bcrypt.compareSync(password, usuario.password))
                    return res.status(200).send(true);
                return res.status(500).send(false);
            })
            .catch(error => res.status(400).send({message:'Datos insuficientes para realizar la validacion'}));;
    },
    update(req, res)
    {

    },
    assignateCargo(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Cargo.findByPk(req.body.idCargo)
                    .then(cargo=>{
                        if(!cargo) {
                            return res.status(400).send({message: 'El cargo no existe'}); 
                            }
                        });
                usuario.getCargos({through: {where: {idCargo: req.body.idCargo}}})
                .then(cargos=>{
                    if(cargos.length != 0)
                        return res.status(400).send({message: 'Cargo ya asignado al usuario'});
                    usuario.addCargos(req.body.idCargo).then(fn=>{
                        return res.status(200).send({message: 'Cargo asignado con exito'});
                    });
                });
            })
            .catch(error => res.status(400).send({message:'Error al realizar la operacion'}));
    },
    unassignateCargo(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Cargo.findByPk(req.body.idCargo)
                    .then(cargo=>{
                        if(!cargo) {
                            return res.status(400).send({message: 'El cargo no existe'}); 
                            }
                        });
                usuario.getCargos({through: {where: {idCargo: req.body.idCargo}}})
                .then(cargos=>{
                    if(cargos.length == 0)
                        return res.status(400).send({message: 'El usuario no tiene asignado este cargo'});
                    usuario.removeCargos(req.body.idCargo).then(fn=>{
                        return res.status(200).send({message: 'Cargo removido con exito'});
                    });
                });
            })
            .catch(error => res.status(400).send({message:'Error al realizar la operacion'}));
    },
    assignateArea(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Area.findByPk(req.body.idArea)
                    .then(area=>{
                        if(!area) {
                            return res.status(400).send({message: 'El area no existe'}); 
                            }
                        });
                usuario.getAreas({through: {where: {idArea: req.body.idArea}}})
                .then(areas=>{
                    if(areas.length != 0)
                        return res.status(400).send({message: 'Area ya asignado al usuario'});
                    usuario.addAreas(req.body.idArea).then(fn=>{
                        return res.status(200).send({message: 'Area asignada con exito'});
                    });
                });
            })
            .catch(error => res.status(400).send({message:'Error al realizar la operacion'}));
    },
    unassignateArea(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Area.findByPk(req.body.idArea)
                    .then(area=>{
                        if(!area) {
                            return res.status(400).send({message: 'El area no existe'}); 
                            }
                        });
                usuario.getAreas({through: {where: {idArea: req.body.idArea}}})
                .then(areas=>{
                    if(areas.length == 0)
                        return res.status(400).send({message: 'El usuario no tiene asignada esta area'});
                    usuario.removeAreas(req.body.idArea).then(fn=>{
                        return res.status(200).send({message: 'Area removida con exito'});
                    });
                });
            })
            .catch(error => res.status(400).send({message:'Error al realizar la operacion'}));
    },
    assignateRol(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                usuario.setRol(req.body.idRol).then(fn=>{
                    return res.status(200).send({message: 'Rol actualizado con exito'});
                });
            })
            .catch(error => res.status(400).send({message:'Error al realizar la operacion'}));
    },
    assignateNotification(req, res)
    {

    },
    unassignateNotification(req, res)
    {

    }

/*FUNCION PARA TESTEAR JSON
    create(req, res)
    {
        console.log("Email: "+ req.body.email);
        console.log("Password: "+ req.body.password);
        console.log("Nombre: "+ req.body.nombre);
        console.log("Apellido Paterno: "+ req.body.a_paterno);

        return User
            .create({
                email: req.body.email,
                password: req.body.password,
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
                    return res.status(400).send({message:'RUT ingresado no es válido'});
                  })(),
                telefono: req.body.telefono,
                codigoColaborador: req.body.codigoColaborador,
                rolUsuario: req.body.rolUsuario
            })
            .then(user => res.status(200).send(true))
            .catch(error => res.status(400).send({message:'Error al agregar al usuario', error}));
    },*/
};