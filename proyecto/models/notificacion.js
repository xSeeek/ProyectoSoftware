'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define('Notificacion', {
    idNotificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Notificacion',
    primaryKey: 'idNotificacion'
  });
  Notificacion.associate = models => {
    Notificacion.belongsToMany(models.Usuario, {
      through: 'NotificacionUsuario',
      as: 'Usuarios Notificacion',
      foreignKey: 'idNotificacion',
      sourceKey: 'idNotificacion'
    })
  };
  return Notificacion;
};