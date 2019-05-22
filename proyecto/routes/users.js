var express = require('express');
var router = express.Router();

const usersController = require('../controllers').users;

router.get('/', (req, res) => res.status(200).send({
  message: 'Bienvenido a la API - SECCION DE USUARIOS',
}));
router.all('/', (req, res) => res.status(405).send({
  message: 'Metodo no permitido',
}));

router.get('/getAll', usersController.list);
router.all('/getAll', (req, res) => res.status(405).send({
  message: 'Metodo no permitido',
}));

router.post('/create', usersController.create);
router.all('/create', (req, res) => res.status(405).send({
  message: 'Metodo no permitido',
}));

router.post('/validateData', usersController.validate);
router.all('/validateData', (req, res) => res.status(405).send({
  message: 'Metodo no permitido'
}));

router.get('/getUser', usersController.retrieve);
router.all('/getUser', (req, res) => res.status(405).send({
  message: 'Metodo no permitido'
}));

router.delete('/removeUser', usersController.destroy);
router.all('/removeUser', (req, res) => res.status(405).send({
  message: 'Metodo no permitido'
}));

module.exports = router;