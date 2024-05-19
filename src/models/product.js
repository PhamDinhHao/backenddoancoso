"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Supplier, { foreignKey: "supplierId", as: "Supplier" });
      Product.belongsTo(models.Unit, { foreignKey: "unitId", as: "Unit" });
      Product.belongsTo(models.Category, { foreignKey: "categoryId", as: "Category" });
      Product.belongsToMany(models.PurchaseDetail, {
        through: "ProductPurchaseDetail",
        foreignKey: "productId",
      });
      Product.belongsToMany(models.SaleDetail, {
        through: "ProductSaleDetail",
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      productName: DataTypes.STRING,
      image: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      description: DataTypes.STRING,
      supplierId: DataTypes.INTEGER,
      unitId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      costPrice: DataTypes.INTEGER,
      salePrice: DataTypes.INTEGER,
      waitTime: DataTypes.INTEGER,

    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
