'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define('Notificacion', {
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {});
  Notificacion.associate = function(models) {
    // associations can be defined here
  };
  return Notificacion;
};