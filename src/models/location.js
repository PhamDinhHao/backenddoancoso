const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.hasMany(models.Product, {
        foreignKey: "locationId",
        as: "Products",
      });
    }
  }
  Location.init(
    {
      locationName: DataTypes.STRING,
      maxWeightCapacity: DataTypes.FLOAT,
      currentWeight: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Location",
    }
  );
  return Location;
};
