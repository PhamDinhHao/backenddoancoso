"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockCheckDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StockCheckDetail.belongsTo(models.StockCheck, {
        foreignKey: "stockCheckId",
        as: "stockCheck",
      });

      StockCheckDetail.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }
  StockCheckDetail.init(
    {
      stockCheckId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      expectedQuantity: DataTypes.INTEGER,
      actualQuantity: DataTypes.INTEGER,
      quantityDifference: DataTypes.INTEGER,
      moneyDifference: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StockCheckDetail",
    }
  );
  return StockCheckDetail;
};
