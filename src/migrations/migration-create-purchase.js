"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Purchases", {
      // purchaseDate: DataTypes.DATE,
      // supplierId: DataTypes.INTEGER,
      // total: DataTypes.INTEGER,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      purchaseDate: {
        type: Sequelize.DATE,
      },
      supplierId: {
        type: Sequelize.INTEGER,
      },
      total: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Purchases");
  },
};
