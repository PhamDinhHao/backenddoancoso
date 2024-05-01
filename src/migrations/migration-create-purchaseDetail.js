"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PurchaseDetails", {
      // productId: DataTypes.INTEGER,
      // purchaseId: DataTypes.INTEGER,
      // quantity: DataTypes.INTEGER,
      // costPrice: DataTypes.INTEGER,
      // salePrice: DataTypes.INTEGER,
      // total: DataTypes.INTEGER,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
      },
      purchaseId: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      costPrice: {
        type: Sequelize.INTEGER,
      },
      salePrice: {
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
    await queryInterface.dropTable("PurchaseDetails");
  },
};
