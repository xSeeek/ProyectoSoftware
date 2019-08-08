'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Cargo', [{
        nombre: 'Administradores del Sistema',
        descripcion: 'Cargo asignado a miembros encargados del mantenimiento y correcto funcionamiento del sistema.',
        estado: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Cargo', null, {});
  }
};
