'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Area', [{
        nombre: 'Administración del Sistema',
        descripcion: 'Área con miembros encargados del mantenimiento y correcto funcionamiento del sistema.',
        estado: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Area', null, {});
  }
};
