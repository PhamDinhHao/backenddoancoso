"use strict";
const { Model } = require("sequelize");
const purchase = require("./purchase");
module.exports = (sequelize, DataTypes) => {
  class SaleDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SaleDetail.belongsTo(models.Product, { foreignKey: "productId" });
      SaleDetail.belongsTo(models.Sale, { foreignKey: "saleId" });
    }
  }
  SaleDetail.init(
    {
      productId: DataTypes.INTEGER,
      saleId: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SaleDetail",
    }
  );
  return SaleDetail;
};
