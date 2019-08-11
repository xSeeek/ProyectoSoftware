'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
      var newCargos = [];
      faker.locale = "es_MX";

      for (var i = 0; i < 10; i++) {
          const seedData = {
            nombre: faker.name.jobArea(),
            descripcion: faker.lorem.sentence(),
            estado: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          newCargos.push(seedData);
      }
      return queryInterface.bulkInsert('Cargo', newCargos);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Cargo', null, {});
  }
};
