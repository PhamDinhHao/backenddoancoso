"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StockChecks", {
      // checkDate: DataTypes.DATE,
      // totalActualQuantity: DataTypes.INTEGER,
      // totalActualMoney: DataTypes.INTEGER,
      // totalIncreaseQuantity: DataTypes.INTEGER,
      // totalIncreaseMoney: DataTypes.INTEGER,
      // totalDecreaseQuantity: DataTypes.INTEGER,
      // totalDecreaseMoney: DataTypes.INTEGER,
      // totalQuantityDifference: DataTypes.INTEGER,
      // totalMoneyDifference: DataTypes.INTEGER,
      // note: DataTypes.STRING,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      checkDate: {
        type: Sequelize.DATE,
      },
      totalActualQuantity: {
        type: Sequelize.INTEGER,
      },
      totalActualMoney: {
        type: Sequelize.INTEGER,
      },
      totalIncreaseQuantity: {
        type: Sequelize.INTEGER,
      },
      totalIncreaseMoney: {
        type: Sequelize.INTEGER,
      },
      totalDecreaseQuantity: {
        type: Sequelize.INTEGER,
      },
      totalDecreaseMoney: {
        type: Sequelize.INTEGER,
      },
      totalQuantityDifference: {
        type: Sequelize.INTEGER,
      },
      totalMoneyDifference: {
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("StockChecks");
  },
};
