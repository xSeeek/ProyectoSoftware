'use strict';
module.exports = (sequelize, DataTypes) => {
  const PreferenciasUsuario = sequelize.define('PreferenciasUsuario', {
    idPreferencia: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    hobbies: {
      type: DataTypes.STRING
    },
    music: {
      type: DataTypes.STRING
    },
    otros: {
      type: DataTypes.STRING
    },
    libros: {
      type: DataTypes.STRING
    },
    escritores: {
      type: DataTypes.STRING
    },
    tvshows: {
      type: DataTypes.STRING
    },
    movies: {
      type: DataTypes.STRING
    },
    games: {
      type: DataTypes.STRING
    }
  }, {});
  PreferenciasUsuario.associate = function(models) {
    // associations can be defined here
  };
  return PreferenciasUsuario;
};