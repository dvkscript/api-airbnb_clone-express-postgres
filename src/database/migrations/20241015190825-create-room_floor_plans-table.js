"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("room_floor_plans", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      guests: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      beds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bathrooms: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 1,
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
    await queryInterface.dropTable("room_floor_plans");
  },
};
