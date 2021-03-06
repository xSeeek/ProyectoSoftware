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
    },
    estado: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Area',
    primaryKey: 'idArea'
  });
  Area.associate = models => {
    Area.belongsToMany(models.Noticia, {
      through: 'AreasNoticias',
      as: 'Noticias',
      foreignKey: 'idArea',
      sourceKey: 'idArea'
    }),
    Area.belongsToMany(models.Beneficio, {
      through: 'AreasBeneficios',
      as: 'Beneficios',
      foreignKey: 'idArea',
      sourceKey: 'idArea'
    }),
    Area.belongsToMany(models.Usuario, {
      through: 'AreasUsuario',
      as: 'Usuarios',
      foreignKey: 'idArea',
      sourceKey: 'idArea'
    })
  };
  return Area;
};