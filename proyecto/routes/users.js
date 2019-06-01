var express = require('express');
var router = express.Router();

const MTH_NOT_ALLOWED = 'Metodo no permitido';
const usersController = require('../controllers').users;

router.get('/', (req, res) => res.status(200).send({
  message: 'Bienvenido a la API - SECCION DE USUARIOS',
}));
router.get('/getAll', usersController.list);
router.post('/create', usersController.create);
router.post('/validateData', usersController.validate);
router.get('/getUser', usersController.retrieve);
router.delete('/removeUser', usersController.destroy);
router.post('/assignCargo', usersController.assignate);
router.post('/unassignCargo', usersController.unassignate);

module.exports = router;