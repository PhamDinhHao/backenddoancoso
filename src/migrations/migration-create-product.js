'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Products', {
            // category: DataTypes.STRING,
            // productName: DataTypes.STRING,
            // cost: DataTypes.INTEGER,
            // sale: DataTypes.INTEGER,
            // image: DataTypes.STRING,
            // quantity: DataTypes.INTEGER,
            // description: DataTypes.STRING
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            category: {
                type: Sequelize.STRING
            },
            productName: {
                type: Sequelize.STRING
            },
            cost: {
                type: Sequelize.INTEGER
            },

            sale: {
                type: Sequelize.INTEGER
            },
            image: {
                type: Sequelize.STRING
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            description: {
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
        await queryInterface.dropTable('Products');
    }
};
