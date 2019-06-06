const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authController = require('../controllers/auth');
const cargosController = require('../controllers').cargos;
const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const areasController = require('../controllers').areas;


/* GET home page. */
router.get('/', auth);
/**
 * Auth
 */
router.post('/authenticate', authController.authenticate);
/**
 * Cargos
 */
router.get('/getAll', auth, cargosController.list);
router.post('/create', auth,  cargosController.create);
router.get('/getCargo', auth,  cargosController.retrieve);
router.delete('/removeCargo', auth, cargosController.destroy);
 /**
  * Users
 */
router.get('/getAll', auth,  usersController.list);
router.post('/create', auth,  usersController.create);
router.post('/validateData', auth,  usersController.validate);
router.get('/getUser', auth, usersController.retrieve);
router.delete('/removeUser', auth,  usersController.destroy);
router.post('/assignCargo', auth, usersController.assignateCargo);
router.post('/unassignCargo',auth,  usersController.unassignateCargo);
router.post('/assignArea', auth,  usersController.assignateArea);
router.post('/unassignArea', auth,  usersController.unassignateArea);
router.post('/assignRol', auth, usersController.assignateRol);
router.post('/assignNotification', auth,  usersController.assignateNotification);
router.post('/unassignNotification', auth,  usersController.unassignateNotification);
/**
 * Areas
 */
router.get('/getAll', auth, areasController.list);
router.post('/create', auth, areasController.create);
router.get('/getArea', auth, areasController.retrieve);
router.delete('/removeArea', auth, areasController.destroy);
/**
 * Roles
 */
router.get('/getAll', auth,rolesController.list);
router.post('/create', auth, rolesController.create);
router.get('/getRol', auth, rolesController.retrieve);
router.delete('/removeRol', auth, rolesController.destroy);




module.exports = router;
