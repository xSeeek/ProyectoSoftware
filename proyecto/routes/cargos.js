var express = require('express');
var router = express.Router();

const cargosController = require('../controllers').cargos;

router.get('/', (req, res) => res.status(200).send({
  message: 'Bienvenido a la API - SECCION DE CARGOS',
}));
router.all('/', (req, res) => res.status(405).send({
    message: 'Metodo no permitido',
}));

router.get('/getAll', cargosController.list);
router.all('/getAll', (req, res) => res.status(405).send({
  message: 'Metodo no permitido',
}));

router.post('/create', cargosController.create);
router.all('/create', (req, res) => res.status(405).send({
  message: 'Metodo no permitido',
}));

module.exports = router;