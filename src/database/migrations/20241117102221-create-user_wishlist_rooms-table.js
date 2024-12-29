"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_wishlist_rooms", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      room_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "rooms",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      wishlist_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "user_wishlists",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_wishlist_rooms");
  },
};
