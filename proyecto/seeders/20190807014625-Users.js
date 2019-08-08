'use strict';

const bcrypt = require('bcryptjs');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Usuario', [{
      email: 'djsjkdsa@yopmail.com',
      password: bcrypt.hashSync('admin20', salt),
      estado: 1,
      nombre: 'Marco',
      a_paterno: 'Cortes',
      a_materno: 'Nieto',
      rut: '1-9',
      telefono:'98765432',
      codigoColaborador: 1,
      rolUsuario: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'urhyweuir@yopmail.com',
      password: bcrypt.hashSync('usuario20', salt),
      estado: 1,
      nombre: 'Silvia',
      a_paterno: 'Segura',
      a_materno: 'Moreno',
      rut: '2-7',
      telefono:'98765432',
      codigoColaborador: 2,
      rolUsuario: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Usuario', null, {});
  }
};
