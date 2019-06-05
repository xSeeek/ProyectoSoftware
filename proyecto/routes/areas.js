var express = require('express');
var router = express.Router();

const MTH_NOT_ALLOWED = 'Metodo no permitido';
const areasController = require('../controllers').areas;

router.get('/', (req, res) => res.status(200).send({
    message: 'Bienvenido a la API - SECCION DE AREAS',
}));

router.get('/getAll', areasController.list);
router.post('/create', areasController.create);
router.get('/getArea', areasController.retrieve);
router.delete('/removeArea', areasController.destroy);

module.exports = router;