'use strict';
module.exports = (sequelize, DataTypes) => {
  const Beneficio = sequelize.define('Beneficio', {
    idBeneficio: {
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
    duracion: 
    {
      type: DataTypes.FLOAT,
      defaultValue: 60
    },
    estado: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'Beneficio',
    primaryKey: 'idBeneficio'
  });
  Beneficio.associate = models => {
    Beneficio.belongsToMany(models.Area, {
      through: 'AreasBeneficios',
      as: 'Áreas',
      foreignKey: 'idBeneficio',
      sourceKey: 'idBeneficio'
    })
  };
  return Beneficio;
};