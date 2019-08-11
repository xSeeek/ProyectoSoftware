'use strict';

const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
      var newAreas = [];
      faker.locale = "es_MX";

      for (var i = 0; i < 10; i++) {
          const seedData = {
            nombre: faker.commerce.department(),
            descripcion: faker.lorem.sentence(),
            estado: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          newAreas.push(seedData);
      }
      return queryInterface.bulkInsert('Area', newAreas);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Area', null, {});
  }
};
