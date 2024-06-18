"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockCheckDetails", {
      // stockCheckId: DataTypes.INTEGER,
      // productId: DataTypes.INTEGER,
      // expectedQuantity: DataTypes.INTEGER,
      // actualQuantity: DataTypes.INTEGER,
      // quantityDifference: DataTypes.INTEGER,
      // moneyDifference: DataTypes.INTEGER,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      stockCheckId: {
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
      },
      expectedQuantity: {
        type: Sequelize.INTEGER,
      },
      actualQuantity: {
        type: Sequelize.INTEGER,
      },
      quantityDifference: {
        type: Sequelize.INTEGER,
      },
      moneyDifference: {
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
    await queryInterface.dropTable("StockCheckDetails");
  },
};
