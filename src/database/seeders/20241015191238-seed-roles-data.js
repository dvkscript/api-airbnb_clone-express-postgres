"use strict";

const roles = require("../data/roles");
const { Role } = require("../../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roleNamesInSeedData = roles.map((role) => role.name);
    const existingRoles = await Role.findAll({
      where: {
        name: roleNamesInSeedData,
      },
    });
    const existingRoleNamesInDb = existingRoles.map((role) => role.name);

    const newRolesToInsert = roles.filter(
      (role) => !existingRoleNamesInDb.includes(role.name)
    );

    if (newRolesToInsert.length > 0) {
      return queryInterface.bulkInsert("roles", newRolesToInsert);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
