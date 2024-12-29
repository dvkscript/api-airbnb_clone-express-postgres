"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_wishlists", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: 'user_wishlists_name_user_id_unique', 
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: 'user_wishlists_name_user_id_unique', 
        references: {
          model: {
            tableName: "users",
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
    }, {
      uniqueKeys: {
        user_wishlists_name_user_id_unique: {
          fields: ["name", "user_id"],
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_wishlists");
  },
};
