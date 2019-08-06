'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AreasNoticias', {
      idArea: {
        allowNull: true,
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        references: {
          model: 'Area',
          key: 'idArea'
        }
      },
      idNoticia :{
        allowNull: true,
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        references: {
          model: 'Noticia',
          key: 'idNoticia'
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
    return queryInterface.dropTable('AreasNoticias');
  }
};
