'use strict';
module.exports = (sequelize, DataTypes) => {
  const Noticia = sequelize.define('Noticia', {
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE,
    duracion: DataTypes.FLOAT
  }, {});
  Noticia.associate = function(models) {
    // associations can be defined here
  };
  return Noticia;
};