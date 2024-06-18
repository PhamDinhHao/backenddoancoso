"use strict";

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("locations", {
      // locationName: DataTypes.STRING,
      // maxWeightCapacity: DataTypes.FLOAT,
      // currentWeight: DataTypes.FLOAT,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      locationName: {
        type: Sequelize.STRING,
      },
      maxWeightCapacity: {
        type: Sequelize.FLOAT,
      },
      currentWeight: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("locations");
  },
};
