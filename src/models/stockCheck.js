"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockCheck extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StockCheck.hasMany(models.StockCheckDetail, {
        foreignKey: "stockCheckId",
        as: "details",
      });
    }
  }
  StockCheck.init(
    {
      checkDate: DataTypes.DATE,
      totalActualQuantity: DataTypes.INTEGER,
      totalActualMoney: DataTypes.INTEGER,
      totalIncreaseQuantity: DataTypes.INTEGER,
      totalIncreaseMoney: DataTypes.INTEGER,
      totalDecreaseQuantity: DataTypes.INTEGER,
      totalDecreaseMoney: DataTypes.INTEGER,
      totalQuantityDifference: DataTypes.INTEGER,
      totalMoneyDifference: DataTypes.INTEGER,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StockCheck",
    }
  );
  return StockCheck;
};
