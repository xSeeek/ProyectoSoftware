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
    assignateNotification(req, res)
    {

    },
    unassignateNotification(req, res)
    {

    },
    getBirthdays(req, res)
    {
        User
            .findAll()
            .then(usuarios => {
                var birthday = new Array();
                var index = 0;
                var today = new Date();
                today.setHours(0,0,0,0)

                for(var i = 0; i < usuarios.length; i++)
                {
                    console.log(usuarios[i].fechaNacimiento + ' vs ' + today);
                    if(+usuarios[i].fechaNacimiento == +today)
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
