'use strict';
module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    idArea: {
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
      allowNull: false
    }
  }, {
    tableName: 'Area',
    primaryKey: 'idArea'
  });
  Area.associate = models => {
    Area.belongsToMany(models.Noticia, {
      through: 'Entidad',
      as: 'Noticias Área',
      foreignKey: 'idArea',
      sourceKey: 'idArea'
    }),
    Area.belongsToMany(models.Beneficio, {
      through: 'Entidad',
      as: 'Beneficios Área',
      foreignKey: 'idArea',
      sourceKey: 'idArea'
    }),
    Area.belongsToMany(models.User, {
      through: 'AreasUsuario',
      as: 'Áreas Usuario',
      foreignKey: 'idArea',
      sourceKey: 'idArea'
    })
  };
  return Area;
};