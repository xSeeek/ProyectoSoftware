'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nombre: DataTypes.STRING,
    a_paterno: DataTypes.STRING,
    a_materno: DataTypes.STRING,
    rut: DataTypes.STRING,
    telefono: DataTypes.STRING,
    codigoColaborador: DataTypes.INTEGER,
    rolUsuario: DataTypes.INTEGER
  }, {});
  Usuario.associate = function(models) {
    // associations can be defined here
  };
  return Usuario;
};