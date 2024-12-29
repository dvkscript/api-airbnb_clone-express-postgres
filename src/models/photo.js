"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Photo.hasOne(models.Profile, {
        foreignKey: "photo_id",
        as: "profile",
      });
      Photo.hasOne(models.Structure, {
        foreignKey: "photo_id",
        as: "structure",
      });
      Photo.hasOne(models.Amenity, {
        foreignKey: "photo_id",
        as: "amenity",
      });
      Photo.hasOne(models.RoomPhoto, {
        foreignKey: "photo_id",
        as: "room",
      });
    }
  }
  Photo.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
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
      modelName: "Photo",
      tableName: "photos",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Photo;
};
