"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Profile.belongsTo(models.Photo, {
        foreignKey: "photo_id",
        as: "thumbnail",
      });
      Profile.belongsTo(models.Address, {
        foreignKey: "address_id",
        as: "address",
      });
    }
  }
  Profile.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      photo_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Profile",
      tableName: "profiles",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Profile;
};
