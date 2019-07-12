'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Rol', [{
        tipo: 'Desarrollador',
        descripcion: 'Desarrollador del Sistema',
        nivel_p: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Rol', null, {});
  }
};
