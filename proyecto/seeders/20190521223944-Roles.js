'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Rol', [{
        tipo: 'Desarrollador',
        descripcion: 'Desarrollador del Sistema',
        createdAt: sequelize.fn('NOW'),
        modifiedAt: sequelize.fn('NOW')
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Rol', null, {});
  }
};
