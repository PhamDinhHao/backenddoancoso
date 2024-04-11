'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Suppier extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Suppier.init({

        name: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        address: DataTypes.STRING,
        email: DataTypes.STRING,
        debtSupplier: DataTypes.INTEGER




    }, {
        sequelize,
        modelName: 'Suppier',
    });
    return Suppier;
};