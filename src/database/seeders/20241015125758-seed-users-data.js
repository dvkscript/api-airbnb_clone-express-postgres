"use strict";
/** @type {import('sequelize-cli').Migration} */

const users = require("../data/users");
const { User } = require("../../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    const userEmailsInSeedData = users.map((u) => u.email);
    const existingUsers = await User.findAll({
      where: {
        email: userEmailsInSeedData,
      },
    });
    const existingUserEmailsInDb = existingUsers.map((u) => u.email);
    const newUsersToInsert = users.filter(
      (u) => !existingUserEmailsInDb.includes(u.email)
    );

    if (newUsersToInsert.length > 0) {
      return queryInterface.bulkInsert("users", newUsersToInsert);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
