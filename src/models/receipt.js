'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Receipt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Receipt.init({

        productId: DataTypes.INTEGER,
        customerId: DataTypes.INTEGER,
        orderTime: DataTypes.DATE,
        quantity: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        note: DataTypes.STRING





    }, {
        sequelize,
        modelName: 'Receipt',
    });
    return Receipt;
};