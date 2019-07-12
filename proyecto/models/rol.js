'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
    idRol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      defaultValue: 'No Especificada'
    },
    estado: {
      type: DataTypes.INTEGER
    },
    nivel_p: {
      type: DataTypes.INTEGER,
      validate: {
        max: 10,
        min: 0
      }
    }
  }, {
    tableName: 'Rol',
    primaryKey: 'idRol'
  });
  Rol.associate = function(models) {
    Rol.hasMany(models.Usuario, {
      foreignKey: 'rolUsuario',
      as: 'Usuarios',
      onDelete: 'SET NULL'
    })
  };
  return Rol;
};