'use strict';
const {
    Model
} = require('sequelize');
const purchase = require('./purchase');
module.exports = (sequelize, DataTypes) => {
    class Receipt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Receipt.hasOne(models.Purchase, { foreignKey: 'receiptId' })
        }
    };
    Receipt.init({

        customerId: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        purchsaeDay: DataTypes.DATE,




    }, {
        sequelize,
        modelName: 'Receipt',
    });
    return Receipt;
};