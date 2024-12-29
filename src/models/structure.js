"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Structure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Structure.hasMany(models.Room, {
        foreignKey: "structure_id",
        as: "rooms",
      });
      Structure.belongsTo(models.Photo, {
        foreignKey: "photo_id",
        as: "photo",
      });
    }
  }
  Structure.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      photo_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: encodeURI(DataTypes.STRING(100)),
        allowNull: false,
        unique: true,
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
      modelName: "Structure",
      tableName: "structures",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Structure;
};
