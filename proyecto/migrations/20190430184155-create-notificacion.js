'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notificacion', {
      idNotificacion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      tipo: {
        type: Sequelize.STRING,
        defaultValue: 'No Especificado'
      },
      idReferencia: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      idArea: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    return queryInterface.dropTable('Notificacion');
  }
};