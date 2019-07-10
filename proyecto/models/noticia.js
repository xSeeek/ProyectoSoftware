'use strict';
module.exports = (sequelize, DataTypes) => {
  const Noticia = sequelize.define('Noticia', {
    idNoticia: {
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
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaFin: DataTypes.DATE,
    duracion: {
      type: DataTypes.FLOAT,
      defaultValue: 60
    },
    estado: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Noticia',
    primaryKey: 'idNoticia'
  });
  Noticia.associate = models => {
    Noticia.belongsToMany(models.Area, {
      through: 'Entidad',
      as: 'Noticias',
      foreignKey: 'idNoticia',
      sourceKey: 'idNoticia'
    })
  };
  return Noticia;
};