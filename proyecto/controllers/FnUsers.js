const User = require('../models').Usuario;
const Area = require('../models').Area;
const Cargo = require('../models').Cargo;
const PreferenciasUsuario = require('../models').PreferenciasUsuario;

module.exports = {
    assignateCargo(idUsuario, newCargos)
    {
        if(newCargos != null && newCargos != "")
        {
            User.findByPk(idUsuario)
                .then(async usuario=>{
                    var arrayCargos = JSON.parse(newCargos);
                    var flagExists = 1;
                    for(var index = 0; index < arrayCargos.length; index++)
                    {
                        flagExists = await (Cargo.findByPk(arrayCargos[index])
                            .then(cargo=>{
                                    if(!cargo)
                                        return 0; 
                                    return 1;
                                }));
                        if(flagExists == 1)
                            await (usuario.getCargos({through: {where: {idCargo: arrayCargos[index]}}})
                            .then(cargos=>{
                                if(cargos == null || cargos.length == 0)
                                    usuario.addCargos(arrayCargos[index]).then(fn=>{});
                                }));
                    }
                })
                .catch(error => {return false;});
            return true;
        }
        return false;
    },
    unassignateCargo(idUsuario, oldCargos)
    {
        if(oldCargos != null && oldCargos != "")
        {
            User.findByPk(idUsuario)
                .then(async usuario=>{
                    var arrayCargos = JSON.parse(oldCargos);
                    var flagExists = 1;
                    for(var index = 0; index < arrayCargos.length; index++)
                    {
                        flagExists = await (Cargo.findByPk(arrayCargos[index])
                            .then(cargo=>{
                                    if(!cargo)
                                        return 0; 
                                    return 1;
                                }));
                        if(flagExists == 1)
                            await (usuario.getCargos({through: {where: {idCargo: arrayCargos[index]}}})
                            .then(cargos=>{
                                if(cargos != null || cargos.length != 0)
                                    usuario.removeCargos(arrayCargos[index]).then(fn=>{});
                                }));
                    }
                })
                .catch(error => {return false});
            return true;
        }
        return false;
    },
    assignateArea(idUsuario, newAreas)
    {
        if(newAreas != null && newAreas != "")
        {
            User.findByPk(idUsuario)
                .then(async usuario=>{
                    var arrayAreas = JSON.parse(newAreas);
                    var flagExists = 1;
                    for(var index = 0; index < arrayAreas.length; index++)
                    {
                        flagExists = await (Area.findByPk(arrayAreas[index])
                            .then(area=>{
                                    if(!area)
                                        return 0; 
                                    return 1;
                                }));
                        if(flagExists == 1)
                            await (usuario.getAreas({through: {where: {idArea: arrayAreas[index]}}})
                            .then(areas=>{
                                if(areas == null || areas.length == 0)
                                    usuario.addAreas(arrayAreas[index]).then(fn=>{});
                                }));
                    }
                })
                .catch(error => {return false;});
            return true;
        }
        return false;
    },
    unassignateArea(idUsuario, oldAreas)
    {
        if(oldAreas != null && oldAreas != "")
        {
            User.findByPk(idUsuario)
                .then(async usuario=>{
                    var arrayAreas = JSON.parse(oldAreas);
                    var flagExists = 1;
                    for(var index = 0; index < arrayAreas.length; index++)
                    {
                        flagExists = await (Area.findByPk(arrayAreas[index])
                            .then(area=>{
                                    if(!area)
                                        return 0; 
                                    return 1;
                                }));
                        if(flagExists == 1)
                            await (usuario.getAreas({through: {where: {idArea: arrayAreas[index]}}})
                            .then(areas=>{
                                if(areas != null || areas.length != 0)
                                    usuario.removeAreas(arrayAreas[index]).then(fn=>{});
                                }));
                    }
                })
                .catch(error => {return false;});
            return true;
        }
        return false;
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
                    if(usuarios[i].fechaNacimiento != null)
                    {
                        userBirthday = usuarios[i].fechaNacimiento;
                        userBirthday.setFullYear(0);
                        userBirthday.setHours(0,0,0,0);
                        if(+userBirthday == +today)
                        {
                            var userData = {
                                "idUsuario"         : usuarios[i].idUsuario,
                                "nombre"            : usuarios[i].nombre,
                                "a_paterno"         : usuarios[i].a_paterno,
                                "a_materno"         : usuarios[i].a_materno,
                                "fechaNacimiento"   : new Date(usuarios[i].fechaNacimiento),
                                "profilePhoto"      : usuarios[i].profilePhoto
                            };
                            birthday[index] = userData;
                            index++;
                        }
                    }
                }
                return res.status(process.env.USR_OK).send(birthday);
            })
    },
    async setPreferencias(idUsuario, data)
    {
        var status = false;
        status = await PreferenciasUsuario.findAll({
            where:{
                idUsuario : idUsuario
            }
        }).then(preferencias => {
            if(preferencias != null && preferencias.length != 0)
            {
                preferencias[0].update({
                    hobbies: data.hobbies || preferencias.hobbies,
                    music: data.music || preferencias.music,
                    otros: data.otros || preferencias.otros,
                    libros: data.libros || preferencias.libros,
                    escritores: data.escritores || preferencias.escritores,
                    tvshows: data.tvshows || preferencias.tvshows,
                    movies: data.movies || preferencias.movies,
                    games: data.games || preferencias.games
                });
                return true;
            }
            return false;
        });

        if(status == false)
            return await this.createPreferencias(idUsuario, data);
        return status
    },
    async createPreferencias(idUsuario, data)
    {
        PreferenciasUsuario
            .create({
                idUsuario: idUsuario,
                hobbies: data.hobbies,
                music: data.music,
                otros: data.otros,
                libros: data.libros,
                escritores: data.escritores,
                tvshows: data.tvshows,
                movies: data.movies,
                games: data.games
            });
        return true;
    }
};
