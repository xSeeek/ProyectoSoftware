const Area = require('../models').Area;

module.exports = {
    list(req, res)
    {
        return Area
            .findAll()
            .then(area => res.status(200).send(area))
            .catch(error => res.status(400).send({message:'No hay areas registradas en el sistema'}));
    }
};