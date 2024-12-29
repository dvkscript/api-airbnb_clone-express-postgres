'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoomPhoto.belongsTo(models.Photo, {
        foreignKey: "photo_id",
        as: "photo",
        onDelete: 'CASCADE'
      });
      RoomPhoto.belongsTo(models.Room, {
        foreignKey: "photo_id",
        as: "room",
      });
    }
  }
  RoomPhoto.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    photo_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    timestamps: true,
    modelName: 'RoomPhoto',
    tableName: 'room_photos',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return RoomPhoto;
};