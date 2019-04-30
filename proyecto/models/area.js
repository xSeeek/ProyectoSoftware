'use strict';
module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {});
  Area.associate = function(models) {
    // associations can be defined here
  };
  return Area;
};