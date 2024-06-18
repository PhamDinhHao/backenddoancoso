'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('OTPs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING
            },
            otp: {
                type: Sequelize.STRING
            },
            expiry_time: {
                type: Sequelize.DATE
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
        await queryInterface.dropTable('OTPs');
    }
};
