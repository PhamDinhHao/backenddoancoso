'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.belongsTo(models.Product, { foreignKey: 'supplierId' })
        }
    };
    Product.init({

        category: DataTypes.STRING,
        productName: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        sale: DataTypes.INTEGER,
        image: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        description: DataTypes.STRING,
        supplierId: DataTypes.INTEGER,



    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};