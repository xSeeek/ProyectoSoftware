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
};