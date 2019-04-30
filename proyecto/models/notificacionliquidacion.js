'use strict';
module.exports = (sequelize, DataTypes) => {
  const NotificacionLiquidacion = sequelize.define('NotificacionLiquidacion', {
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    estado: DataTypes.BOOLEAN,
    idUsuario: DataTypes.INTEGER
  }, {});
  NotificacionLiquidacion.associate = function(models) {
    // associations can be defined here
  };
  return NotificacionLiquidacion;
};