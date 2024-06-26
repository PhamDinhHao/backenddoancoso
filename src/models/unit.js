"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Unit.hasMany(models.Product, { foreignKey: "unitId", as: "Unit" });
    }
  }
  Unit.init(
    {
      unitName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Unit",
    }
  );
  return Unit;
};
