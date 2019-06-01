var express = require('express');
var router = express.Router();

const MTH_NOT_ALLOWED = 'Metodo no permitido';
const cargosController = require('../controllers').cargos;

router.get('/', (req, res) => res.status(200).send({
  message: 'Bienvenido a la API - SECCION DE CARGOS',
}));
/*router.all('/', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));
*/

router.get('/getAll', cargosController.list);
/*
router.all('/getAll', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));
*/

router.post('/create', cargosController.create);
/*
router.all('/create', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));
*/

router.get('/getCargo', cargosController.retrieve);
/*
router.all('/getCargo', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED
}));
*/

router.delete('/removeCargo', cargosController.destroy);
/*
router.all('/removeCargo', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED
}));
*/

module.exports = router;