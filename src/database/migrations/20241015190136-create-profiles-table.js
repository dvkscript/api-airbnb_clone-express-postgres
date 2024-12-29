"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profiles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      gender: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      photo_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "photos",
          },
          key: "id",
        },
        onDelete: "SET NULL",
      },
      address_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "addresses",
          },
          key: "id",
        },
        onDelete: "SET NULL",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("profiles");
  },
};
