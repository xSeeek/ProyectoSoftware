'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cargo = sequelize.define('Cargo', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {});
  Cargo.associate = function(models) {
    // associations can be defined here
  };
  return Cargo;
};