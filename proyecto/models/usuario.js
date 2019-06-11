'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    a_paterno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    a_materno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigoColaborador: {
      type: DataTypes.INTEGER
    },
    reset_password_token: {
      type: DataTypes.STRING,
    },
    reset_password_expires: {
      type: Date,
    }
  }, {
    tableName: 'Usuario',
    primaryKey: 'idUsuario'
  });
  Usuario.associate = models => {
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'rolUsuario',
      as: 'Rol',
      onDelete: 'SET NULL'
    }),
    Usuario.hasMany(models.NotificacionLiquidacion, {
      foreignKey: 'idUsuario',
      as: 'Liquidaciones',
      onDelete: 'CASCADE'
    }),
    Usuario.belongsToMany(models.Area, {
      through: 'AreasUsuario',
      as: 'Areas',
      foreignKey: 'idUsuario',
      sourceKey: 'idUsuario'
    }),
    Usuario.belongsToMany(models.Cargo, {
      through: 'CargosUsuario',
      as: 'Cargos',
      foreignKey: 'idUsuario',
      sourceKey: 'idUsuario'
    }),
    Usuario.belongsToMany(models.Notificacion, {
      through: 'NotificacionUsuario',
      as: 'Notificaciones',
      foreignKey: 'idUsuario',
      sourceKey: 'idUsuario'
    })
  };
  return Usuario;
};