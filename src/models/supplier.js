"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Supplier.hasMany(models.Product, {
        foreignKey: "supplierId",
        // as: "Supplier",
      });
      Supplier.hasMany(models.Purchase, { foreignKey: "supplierId" });
    }
  }
  Supplier.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      debtSupplier: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
