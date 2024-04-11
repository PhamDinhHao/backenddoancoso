'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Customers', {
            //     name: DataTypes.STRING,
            // address: DataTypes.STRING,
            // phoneNumber: DataTypes.STRING,
            // gender: DataTypes.STRING,
            // birthday: DataTypes.DATE,
            // debtCustomer: DataTypes.INTERGER

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            phoneNumber: {
                type: Sequelize.STRING
            },

            gender: {
                type: Sequelize.STRING
            },
            birthday: {
                type: Sequelize.DATE
            },
            debtCustomer: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('Customers');
    }
};
