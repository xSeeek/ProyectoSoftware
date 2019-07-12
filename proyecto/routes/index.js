const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

const authController = require('../controllers/auth');
const cargosController = require('../controllers').cargos;
const usersController = require('../controllers').users;
const rolesController = require('../controllers').roles;
const areasController = require('../controllers').areas;
const beneficiosController = require('../controllers').beneficios;
const noticiasController = require('../controllers').noticias;
const fnUsersController = require('../controllers').fnUsers;

/* GET home page. */
router.get('/', auth);

/**
 * Auth
 */
router.post('/authenticate', authController.authenticate);

/**
  * Users
 */
router.get('/users/getAll', auth(10), usersController.list);
router.get('/users/getAllComplete', usersController.listAllRelationships);
router.post('/users/create',  auth(10), usersController.create);
router.put('/users/edit', usersController.edit);
router.post('/users/validateData',  usersController.validate);
router.post('/users/getUser', usersController.retrieve);
router.delete('/users/removeUser',  usersController.destroy);
router.post('/users/validateEmail', usersController.confirmEmail);
router.post('/users/changeStatus', usersController.changeStatus);

/**
 * Funciones relacionadas con Usuarios
 */
router.post('/assignCargo',fnUsersController.assignateCargo);
router.post('/unassignCargo' ,fnUsersController.unassignateCargo);
router.post('/assignArea', fnUsersController.assignateArea);
router.post('/unassignArea',   fnUsersController.unassignateArea);
router.post('/assignRol', fnUsersController.assignateRol);
router.post('/assignNotification',   fnUsersController.assignateNotification);
router.post('/unassignNotification',  fnUsersController.unassignateNotification);

/**
 * Cargos
 */
router.get('/cargos/getAll', cargosController.list);
router.post('/cargos/create',  cargosController.create);
router.put('/cargos/edit', cargosController.edit);
router.get('/cargos/getCargo', auth(0),  cargosController.retrieve);
router.delete('/cargos/removeCargo', auth(0), cargosController.destroy);
router.post('/cargos/changeStatus', cargosController.changeStatus);

/**
 * Areas
 */
router.get('/areas/getAll',  areasController.list);
router.post('/areas/create',  areasController.create);
router.put('/areas/edit', areasController.edit);
router.get('/areas/getArea', auth(0), areasController.retrieve);
router.delete('/areas/removeArea', auth(0), areasController.destroy);
router.post('/areas/changeStatus', areasController.changeStatus);

/**
 * Roles
 */
router.get('/roles/getAll', rolesController.list);
router.post('/roles/create',  rolesController.create);
router.put('/roles/edit', rolesController.edit);
router.get('/roles/getRol',  rolesController.retrieve);
router.delete('/roles/removeRol', auth(0), rolesController.destroy);
router.post('/roles/changeStatus', rolesController.changeStatus);

/**
 * Beneficios 
 */
router.post('/beneficios/create',  beneficiosController.create);
router.put('/beneficios/edit', beneficiosController.edit);
router.get('/beneficios/getAll', beneficiosController.list);
router.get('/beneficios/getBenefit', beneficiosController.retrieve);
router.delete('/beneficios/removeBenefit', beneficiosController.destroy);
router.post('/beneficios/changeStatus', beneficiosController.changeStatus);

/**
 * Noticias
 */

router.post('/noticias/create', noticiasController.create);
router.put('/noticias/edit', noticiasController.edit);
router.get('/noticias/getAll', noticiasController.list);
router.get('/noticias/getNews', noticiasController.retrieve);
router.delete('/noticias/removeNews', noticiasController.destroy);
router.post('/noticias/changeStatus', noticiasController.changeStatus);

/**
 * Auth
 * Password
 */
router.post('/forgot_password', authController.forgot_password);
router.post('/reset_password', authController.reset_password);
router.post('/changePassword', authController.changePassword);

module.exports = router;
