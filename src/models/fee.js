"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Fee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Fee.hasOne(models.Room, {
                foreignKey: "fee_id",
                as: "fee",
            });
        }
    }

    Fee.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            country_code: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
            },
            app_fee: {
                type: DataTypes.DECIMAL(3, 2),
                allowNull: false,
            },
            service_fee: {
                type: DataTypes.DECIMAL(3, 2),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Fee",
            tableName: "fees",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
    return Fee;
};
