"use strict";

const permissions = require("../data/permissions");
const { Permission } = require("../../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const permissionValuesInSeedData = permissions.map((p) => p.value);
    const existingPermissions = await Permission.findAll({
      where: {
        value: permissionValuesInSeedData,
      },
    });
    const existingPermissionValuesInDb = existingPermissions.map(
      (p) => p.value
    );

    const newPermissionsToInsert = permissions.filter(
      (p) => !existingPermissionValuesInDb.includes(p.value)
    );

    if (newPermissionsToInsert.length > 0) {
      return queryInterface.bulkInsert("permissions", newPermissionsToInsert);
    }
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("permissions", null, {});
  },
};
