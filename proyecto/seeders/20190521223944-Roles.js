'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Rol', [{
        tipo: 'Admin',
        descripcion: 'Administrador del Sistema',
        nivel_p: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo: 'User',
        descripcion: 'Usuario del Sistema',
        nivel_p: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Rol', null, {});
  }
};
