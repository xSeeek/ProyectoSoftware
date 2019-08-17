'use strict';
module.exports = (sequelize, DataTypes) => {
  const PreferenciasUsuario = sequelize.define('PreferenciasUsuario', {
    idPrefereciasUsuario: {
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
  }, {
    tableName: 'PreferenciasUsuario',
    primaryKey: 'idPrefereciasUsuario'
  });
  PreferenciasUsuario.associate = function(models) {
    PreferenciasUsuario.belongsTo(models.Usuario, {
      foreignKey: 'idUsuario',
      as: 'Usuario',
      onDelete: 'CASCADE'
    })
  };
  return PreferenciasUsuario;
};