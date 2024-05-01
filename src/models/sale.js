"use strict";
const { Model } = require("sequelize");
const purchase = require("./purchase");
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.hasMany(models.SaleDetail);
      Sale.belongsTo(models.Customer, { foreignKey: "customerId" });
    }
  }
  Sale.init(
    {
      customerId: DataTypes.INTEGER,
      saleDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Sale",
    }
  );
  return Sale;
};
