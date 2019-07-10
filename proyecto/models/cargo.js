'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cargo = sequelize.define('Cargo', {
    idCargo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      defaultValue: 'No Especificada'
    },
    estado: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Cargo',
    primaryKey: 'idCargo'
  });
  Cargo.associate = models => {
    Cargo.belongsToMany(models.Usuario, {
      through: 'CargosUsuario',
      as: 'Usuarios',
      foreignKey: 'idCargo',
      sourceKey: 'idCargo'
    })
  };
  return Cargo;
};