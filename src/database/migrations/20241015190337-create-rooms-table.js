"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      statusText: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "idle",
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      instant_book: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      privacy_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      structure_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "structures",
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
      fee_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "fees",
          },
          key: "id",
        },
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("rooms");
  },
};
