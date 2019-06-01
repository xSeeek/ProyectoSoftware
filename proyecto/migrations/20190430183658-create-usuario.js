'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Usuario', {
      idUsuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      a_paterno: {
        type: Sequelize.STRING
      },
      a_materno: {
        type: Sequelize.STRING
      },
      rut: {
        type: Sequelize.STRING,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING
      },
      codigoColaborador: {
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      rolUsuario: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        references: {
          model: 'Rol',
          key: 'idRol'
        }
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
    return queryInterface.dropTable('Usuario');
  }
};