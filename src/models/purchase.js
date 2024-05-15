"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase.hasMany(models.PurchaseDetail, { foreignKey: "purchaseId" });
      Purchase.belongsTo(models.Supplier, { foreignKey: "supplierId" });
    }
  }
  Purchase.init(
    {
      purchaseDate: DataTypes.DATE,
      supplierId: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Purchase",
    }
  );
  return Purchase;
};
