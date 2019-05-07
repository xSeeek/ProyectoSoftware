'use strict';
module.exports = (sequelize, DataTypes) => {
  const NotificacionLiquidacion = sequelize.define('NotificacionLiquidacion', {
    idLiquidacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'NotificacionLiquidacion',
    primaryKey: 'idLiquidacion'
  });
  NotificacionLiquidacion.associate = models => {
    NotificacionLiquidacion.belongsTo(models.Usuario, {
      foreignKey: 'idUsuario',
      as: 'Usuario',
      inDelete: 'SET NULL'
    })
  };
  return NotificacionLiquidacion;
};