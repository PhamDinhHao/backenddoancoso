'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Purchase extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Purchase.belongsTo(models.Purchase, { foreignKey: 'customerId' })
            Purchase.belongsTo(models.Purchase, { foreignKey: 'receiptId' })
        }
    };
    Purchase.init({

        productId: DataTypes.INTEGER,
        customerId: DataTypes.INTEGER,
        receiptId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        note: DataTypes.STRING





    }, {
        sequelize,
        modelName: 'Purchase',
    });
    return Purchase;
};