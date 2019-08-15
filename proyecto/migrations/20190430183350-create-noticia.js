'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Noticia', {
      idNoticia: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.STRING(3000),
        defaultValue: 'No especificada'
      },
      fechaInicio: {
        type: Sequelize.DATE
      },
      fechaFin: {
        type: Sequelize.DATE
      },
      duracion: {
        type: Sequelize.FLOAT
      },
      estado: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      tipo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      banner: {
        type: Sequelize.STRING,
        allowNull: true
      },
      photo: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true
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
    return queryInterface.dropTable('Noticia');
  }
};