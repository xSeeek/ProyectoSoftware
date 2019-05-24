var express = require('express');
var router = express.Router();

const MTH_NOT_ALLOWED = 'Metodo no permitido';
const usersController = require('../controllers').users;

router.get('/', (req, res) => res.status(200).send({
  message: 'Bienvenido a la API - SECCION DE USUARIOS',
}));
router.all('/', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));

router.get('/getAll', usersController.list);
router.all('/getAll', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));

router.post('/create', usersController.create);
router.all('/create', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));

router.post('/validateData', usersController.validate);
router.all('/validateData', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));

router.get('/getUser', usersController.retrieve);
router.all('/getUser', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));

router.delete('/removeUser', usersController.destroy);
router.all('/removeUser', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}));

router.post('/assignCargo', usersController.assignate);
router.all('/assignCargo', (req, res) => res.status(405).send({
  message: MTH_NOT_ALLOWED,
}))

module.exports = router;