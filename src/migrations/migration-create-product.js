"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      // productName: DataTypes.STRING,
      // image: DataTypes.STRING,
      // quantity: DataTypes.INTEGER,
      // description: DataTypes.STRING,
      // supplierId: DataTypes.INTEGER,
      // unitId: DataTypes.INTEGER,
      // categoryId: DataTypes.INTEGER,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productName: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING,
      },
      supplierId: {
        type: Sequelize.INTEGER,
      },
      unitId: {
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      costPrice: {
        type: Sequelize.INTEGER,
      },
      salePrice: {
        type: Sequelize.INTEGER,
      },
      waitTime: {
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
    await queryInterface.dropTable("Products");
  },
};
