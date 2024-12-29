"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.hasOne(models.Tenant, {
        foreignKey: "booking_id",
        as: "tenant",
      });
      Booking.hasOne(models.Landlord, {
        foreignKey: "booking_id",
        as: "landlord",
      });
      Booking.hasOne(models.BookingRoom, {
        foreignKey: "booking_id",
        as: "room",
      });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      payment_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      check_in: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      check_out: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      app_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      service_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Booking;
};
