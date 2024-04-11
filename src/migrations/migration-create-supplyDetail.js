'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('SupplyDetails', {
            //     productId: DataTypes.INTERGER,
            // customerId: DataTypes.INTERGER,
            // orderTime: DataTypes.DATE,
            // quantity: DataTypes.INTERGER,
            // total: DataTypes.INTERGER,
            // note: DataTypes.STRING

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            productId: {
                type: Sequelize.INTEGER
            },
            supplierId: {
                type: Sequelize.INTEGER
            },
            orderTime: {
                type: Sequelize.DATE
            },

            quantity: {
                type: Sequelize.INTEGER
            },
            total: {
                type: Sequelize.INTEGER
            },
            note: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('SupplyDetails');
    }
};
