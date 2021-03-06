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
        type: Sequelize.STRING,
        allowNull: true
      },
      estado: {
        type: Sequelize.INTEGER,
        defaultValue: 1
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
      fechaNacimiento: {
        type: Sequelize.DATE,
        defaultValue: new Date('01/01/1970 00:00:00')
      },
      codigoColaborador: {
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      profilePhoto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coverPhoto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aboutMe: {
        type: Sequelize.STRING,
        defaultValue: 'Nada interesante por aquí.'
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
      validate_token: {
        type: Sequelize.STRING
      },
      validate_token_expires: {
        type: Sequelize.DATE
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
