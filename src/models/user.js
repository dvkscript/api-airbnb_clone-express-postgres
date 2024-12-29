"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: "user_id", as: "profile" });
      User.hasMany(models.UserToken, { foreignKey: "user_id", as: "tokens" });
      User.belongsToMany(models.Role, {
        through: "users_roles",
        foreignKey: "user_id",
        as: "roles",
      });
      User.belongsToMany(models.Permission, {
        through: "users_permissions",
        foreignKey: "user_id",
        as: "permissions",
      });
      User.belongsToMany(models.Provider, {
        through: "users_providers",
        foreignKey: "user_id",
        as: "providers",
      });
      User.hasMany(models.Room, { foreignKey: "user_id", as: "rooms" });
      User.hasMany(models.UserWishlist, {
        foreignKey: "user_id",
        as: "wishlist",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      full_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
