'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PreferenciasUsuario', {
      idPrefereciasUsuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idUsuario: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true
      },
      hobbies: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguno'
      },
      music: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguna'
      },
      otros: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguno'
      },
      libros: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguno'
      },
      escritores: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguno'
      },
      tvshows: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguno'
      },
      movies: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguna'
      },
      games: {
        type: Sequelize.STRING,
        defaultValue: 'Ninguno'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PreferenciasUsuario');
  }
};