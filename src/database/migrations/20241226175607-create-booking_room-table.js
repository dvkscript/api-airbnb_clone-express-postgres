"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("booking_rooms", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      booking_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "bookings",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      privacy_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      guests: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      children: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      infants: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      pets: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
    await queryInterface.dropTable("booking_rooms");
  },
};
