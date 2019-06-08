const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

const authController = require('../controllers/auth');
const cargosController = require('../controllers').cargos;
const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const areasController = require('../controllers').areas;
const fnUsersController = require('../controllers').fnUsers;


/* GET home page. */
router.get('/', auth);

/**
 * Auth
 */
router.post('/authenticate', authController.authenticate);

/**
 * Cargos
 */
router.get('/cargos/getAll', auth, cargosController.list);
router.post('/cargos/create', auth,  cargosController.create);
router.get('/cargos/getCargo', auth,  cargosController.retrieve);
router.delete('/cargos/removeCargo', auth, cargosController.destroy);

 /**
  * Users
 */
router.get('/users/getAll', auth,  usersController.list);
router.post('/users/create', auth,  usersController.create);
router.put('/users/edit', usersController.edit);
router.post('/users/validateData', auth,  usersController.validate);
router.get('/users/getUser', auth, usersController.retrieve);
router.delete('/users/removeUser', auth,  usersController.destroy);

/**
 * Funciones relacionadas con Usuarios
 */
router.post('/assignCargo', auth, fnUsersController.assignateCargo);
router.post('/unassignCargo',auth,  fnUsersController.unassignateCargo);
router.post('/assignArea', auth,  fnUsersController.assignateArea);
router.post('/unassignArea', auth,  fnUsersController.unassignateArea);
router.post('/assignRol', auth, fnUsersController.assignateRol);
router.post('/assignNotification', auth,  fnUsersController.assignateNotification);
router.post('/unassignNotification', auth,  fnUsersController.unassignateNotification);

/**
 * Areas
 */
router.get('/areas/getAll', auth, areasController.list);
router.post('/areas/create', auth, areasController.create);
router.get('/areas/getArea', auth, areasController.retrieve);
router.delete('/areas/removeArea', auth, areasController.destroy);

/**
 * Roles
 */
router.get('/roles/getAll', auth,rolesController.list);
router.post('/roles/create', auth, rolesController.create);
router.get('/roles/getRol', auth, rolesController.retrieve);
router.delete('/roles/removeRol', auth, rolesController.destroy);

module.exports = router;
