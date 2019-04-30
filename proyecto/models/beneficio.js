'use strict';
module.exports = (sequelize, DataTypes) => {
  const Beneficio = sequelize.define('Beneficio', {
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE,
    duracion: DataTypes.FLOAT
  }, {});
  Beneficio.associate = function(models) {
    // associations can be defined here
  };
  return Beneficio;
};