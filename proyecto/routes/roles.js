var express = require('express');
var router = express.Router();

const MTH_NOT_ALLOWED = 'Metodo no permitido';
const rolesController = require('../controllers').roles;

router.get('/', (req, res) => res.status(200).send({
    message: 'Bienvenido a la API - SECCION DE ROLES',
  }));

router.get('/getAll', rolesController.list);
router.post('/create', rolesController.create);
router.get('/getRol', rolesController.retrieve);
router.delete('/removeRol', rolesController.destroy);

module.exports = router;