'use strict';
const fees = require("../data/fees");
const { Fee } = require("../../models");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const feeCountryCodes = fees.map((f) => f.country_code);
    const existingFee = await Fee.findAll({
      where: {
        country_code: feeCountryCodes,
      }
    });
    const existingFeeCountryCodeInDb = existingFee.map((f) => f.country_code);
    const newUFeesToInsert = fees.filter(
        (u) => !existingFeeCountryCodeInDb.includes(u.country_code)
    );
    if (newUFeesToInsert.length > 0) {
      return queryInterface.bulkInsert("fees", newUFeesToInsert);
    }
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("fees", null, {})
  }
};
