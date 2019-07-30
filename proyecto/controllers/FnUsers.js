const User = require('../models').Usuario;
const Area = require('../models').Area;
const Cargo = require('../models').Cargo;

module.exports = {
    assignateCargo(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Cargo.findByPk(req.body.idCargo)
                    .then(cargo=>{
                        if(!cargo) {
                            return res.status(process.env.USR_CRG_NFG).send({message: 'El cargo no existe'}); 
                            }
                        });
                usuario.getCargos({through: {where: {idCargo: req.body.idCargo}}})
                .then(cargos=>{
                    if(cargos.length != 0)
                        return res.status(process.env.USR_CRG_ARD).send({message: 'Cargo ya asignado al usuario'});
                    usuario.addCargos(req.body.idCargo).then(fn=>{
                        return res.status(process.env.USR_CRG_OK).send({message: 'Cargo asignado con exito'});
                    });
                });
            })
            .catch(error => res.status(process.env.USR_CRG_ERR).send({message:'Error al realizar la operacion'}));
    },
    unassignateCargo(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Cargo.findByPk(req.body.idCargo)
                    .then(cargo=>{
                        if(!cargo) {
                            return res.status(process.env.USR_CRG_NFG).send({message: 'El cargo no existe'}); 
                            }
                        });
                usuario.getCargos({through: {where: {idCargo: req.body.idCargo}}})
                .then(cargos=>{
                    if(cargos.length == 0)
                        return res.status(process.env.USR_CRG_ARD).send({message: 'El usuario no tiene asignado este cargo'});
                    usuario.removeCargos(req.body.idCargo).then(fn=>{
                        return res.status(process.env.USR_CRG_OK).send({message: 'Cargo removido con exito'});
                    });
                });
            })
            .catch(error => res.status(process.env.USR_CRG_ERR).send({message:'Error al realizar la operacion'}));
    },
    assignateArea(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Area.findByPk(req.body.idArea)
                    .then(area=>{
                        if(!area) {
                            return res.status(process.env.USR_ARE_NFD).send({message: 'El area no existe'}); 
                            }
                        });
                usuario.getAreas({through: {where: {idArea: req.body.idArea}}})
                .then(areas=>{
                    if(areas.length != 0)
                        return res.status(process.env.USR_ARE_ARD).send({message: 'Area ya asignado al usuario'});
                    usuario.addAreas(req.body.idArea).then(fn=>{
                        return res.status(process.env.USR_ARE_OK).send({message: 'Area asignada con exito'});
                    });
                });
            })
            .catch(error => res.status(process.env.USR_ARE_ERR).send({message:'Error al realizar la operacion'}));
    },
    unassignateArea(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                Area.findByPk(req.body.idArea)
                    .then(area=>{
                        if(!area) {
                            return res.status(process.env.USR_ARE_NFD).send({message: 'El area no existe'}); 
                            }
                        });
                usuario.getAreas({through: {where: {idArea: req.body.idArea}}})
                .then(areas=>{
                    if(areas.length == 0)
                        return res.status(rocess.env.USR_ARE_ARD).send({message: 'El usuario no tiene asignada esta area'});
                    usuario.removeAreas(req.body.idArea).then(fn=>{
                        return res.status(process.env.USR_ARE_OK).send({message: 'Area removida con exito'});
                    });
                });
            })
            .catch(error => res.status(process.env.USR_ARE_ERR).send({message:'Error al realizar la operacion'}));
    },
    assignateRol(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                usuario.setRol(req.body.idRol).then(fn=>{
                    return res.status(process.env.USR_ROL_OK).send({message: 'Rol actualizado con exito'});
                });
            })
            .catch(error => res.status(process.env.USR_ROL_NFD).send({message:'Error al realizar la operacion'}));
    },
    assignateNotification(idUsuario, idNotificacion)
    {
        User.findByPk(idUsuario)
            .then(usuario=>{
                usuario.addNotificaciones(idNotificacion).then(fn=>{
                    console.log("Notificacion Asignada");
                });
            })
    },
    markAsViewedNotification(req, res)
    {
        User.findByPk(req.body.idUsuario)
            .then(usuario=>{
                var arrayNotifications = JSON.parse(req.body.idNotificacion);
                for(var index = 0; index < arrayNotifications.length; index++)
                    usuario.getNotificaciones({through: {where: {idNotificacion: arrayNotifications[index]}}}).then(fn => {
                        fn[0].update({
                            estado: 1
                        });
                    })
                    .catch(error => res.status(process.env.USR_ERR).send({message:'Error al realizar la operacion'}));
                return res.status(process.env.USR_OK).send({message: 'Estado actualizado con exito'});
            });
    },
    markAsOpenedNotification(req, res)
    {
        User.findByPk(req.body.idUsuario)
        .then(usuario=>{
            usuario.getNotificaciones({through: {where: {idNotificacion: req.body.idNotificacion}}}).then(fn => {
                return fn[0].update({
                    estado: 2
                })
                .then(status => {
                    return res.status(process.env.USR_OK).send({message: 'Estado actualizado con exito'});
                });
            }).catch(error => res.status(process.env.USR_ERR).send({message:'Error al realizar la operacion'}));
        });
    },
    getBirthdays(req, res)
    {
        User
            .findAll()
            .then(usuarios => {
                var birthday = new Array();
                var index = 0;
                var today = new Date();
                today.setHours(0,0,0,0);
                today.setFullYear(0);

                for(var i = 0; i < usuarios.length; i++)
                {
                    userBirthday = usuarios[i].fechaNacimiento;
                    userBirthday.setFullYear(0);
                    if(+userBirthday == +today)
                    {
                        var userData = new Array();

                        userData[0] = usuarios[i].idUsuario;
                        userData[1] = usuarios[i].nombre;
                        userData[2] = usuarios[i].a_paterno;
                        userData[3] = usuarios[i].a_materno;
                        userData[4] = new Date(usuarios[i].fechaNacimiento);

                        birthday[index] = userData;
                        index++;
                    }
                }
                return res.status(process.env.USR_OK).send(birthday);
            })
    }
};
