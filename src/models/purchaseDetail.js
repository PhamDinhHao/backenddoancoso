"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PurchaseDetail.belongsTo(models.Product, { foreignKey: "productId" });
      PurchaseDetail.belongsTo(models.Purchase, { foreignKey: "purchaseId" });
    }
  }
  PurchaseDetail.init(
    {
      productId: DataTypes.INTEGER,
      purchaseId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      costPrice: DataTypes.INTEGER,
      salePrice: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PurchaseDetail",
    }
  );
  return PurchaseDetail;
};
