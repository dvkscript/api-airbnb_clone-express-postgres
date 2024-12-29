"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms_amenities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      amenity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "amenities",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "rooms",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rooms_amenities");
  },
};
