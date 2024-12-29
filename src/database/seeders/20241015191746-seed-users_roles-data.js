"use strict";

const { User, Role } = require("../../models");
const roles = require("../data/roles");
const users = require("../data/users");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [khoacoding, khoa, roleAdmin] = await Promise.all([
      User.findOne({
        where: {
          email: users[1].email,
        },
      }),
      User.findOne({
        where: {
          email: users[0].email,
        },
      }),
      Role.findOne({
        where: {
          name: roles[0].name,
        },
      }),
    ]);

    await khoacoding.setRoles(roleAdmin);
    await khoa.setRoles(roleAdmin);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users_roles", null, {});
  },
};
