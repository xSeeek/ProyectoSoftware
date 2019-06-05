const Area = require('../models').Area;
const Usuario = require('../models').Usuario;

module.exports = {
    list(req, res)
    {
        return Area
            .findAll()
            .then(area => res.status(200).send(area))
            .catch(error => res.status(400).send({message:'No hay areas registradas en el sistema'}));
    },
    create(req, res)
    {
        return Area
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
            })
            .then(area => res.status(200).send(area))
            .catch(error => res.status(400).send({message:'Error al agregar el Area', error}));
    },
    retrieve(req, res)
    {
        return Area
            .findAll({
                where: {
                    idArea: req.body.idArea
                },
                include: [
                    {
                        model: Usuario,
                        as: 'Usuarios',
                        attributes: {
                            exclude: ['password']
                        }
                    }
                ],
                plain : true
            })
            .then(area => {
                console.log(area);
                if(!area)
                    return res.status(400).send({message:'Area no encontrada o no existe'});
                return res.status(200).send(area);
            })
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res)
    {
        return Area
            .findByPk(req.body.idArea)
            .then(area => {
                if(!area)
                    return res.status(404).send({message: 'Area no encontrada'});
                return area
                    .destroy()
                    .then(() => res.status(200).send({message: 'Area eliminada del sistema'}))
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res)
    {
        
    }
};