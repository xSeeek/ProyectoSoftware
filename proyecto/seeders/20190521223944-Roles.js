'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Rol', [{
        tipo: 'Desarrollador',
        descripcion: 'Desarrollador del Sistema',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Rol', null, {});
  }
};
