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
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    tableName: 'Noticia',
    primaryKey: 'idNoticia'
  });
  Noticia.associate = models => {
    Noticia.belongsToMany(models.Area, {
      through: 'AreasNoticias',
      as: 'Areas',
      foreignKey: 'idNoticia',
      sourceKey: 'idNoticia'
    })
  };
  return Noticia;
};