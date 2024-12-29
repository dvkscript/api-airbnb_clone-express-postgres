"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomFloorPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoomFloorPlan.belongsTo(models.Room, {
        foreignKey: "room_id",
        as: "room",
      });
    }
  }
  RoomFloorPlan.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      beds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bathrooms: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 1,
      },
      room_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "RoomFloorPlan",
      tableName: "room_floor_plans",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return RoomFloorPlan;
};
