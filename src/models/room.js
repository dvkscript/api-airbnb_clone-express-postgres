"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Room.belongsTo(models.Structure, {
        foreignKey: "structure_id",
        as: "structure",
      });
      Room.belongsTo(models.Address, {
        foreignKey: "address_id",
        as: "address",
      });
      Room.hasOne(models.RoomFloorPlan, {
        foreignKey: "room_id",
        as: "floorPlan",
      });
      Room.belongsToMany(models.Amenity, {
        through: "rooms_amenities",
        foreignKey: "room_id",
        as: "amenities",
      });
      Room.belongsTo(models.Fee, {
        foreignKey: "fee_id",
        as: "fee",
      });
      Room.hasMany(models.RoomPhoto, {
        foreignKey: "room_id",
        as: "photos",
        onDelete: 'CASCADE'
      });
      Room.hasMany(models.RoomDiscount, {
        foreignKey: "room_id",
        as: "discounts",
      });
      Room.belongsToMany(models.UserWishlist, {
        through: "user_wishlist_rooms",
        foreignKey: "room_id",
        as: "wishlists",
      });
    }
  }
  Room.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      statusText: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "idle",
      },
      original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      instant_book: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      privacy_type: {
        allowNull: true,
        type: DataTypes.STRING(50),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      structure_id: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      address_id: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      fee_id: {
        allowNull: true,
        type: DataTypes.UUID,
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
      timestamps: true,
      modelName: "Room",
      tableName: "rooms",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Room;
};
