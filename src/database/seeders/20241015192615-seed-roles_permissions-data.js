"use strict";

const { Role, Permission } = require("../../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roleAdmin = await Role.findOne({
      where: {
        name: "Super admin",
      },
    });
    const permissions = await Permission.findAll();

    if (!roleAdmin && permissions?.length < 1) {
      return;
    }

    await roleAdmin.setPermissions(permissions);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("roles_permissions", null, {});
  },
};
