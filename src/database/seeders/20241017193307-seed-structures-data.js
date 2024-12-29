"use strict";
const PhotoEnum = require("../../enums/photo");
const structures = require("../data/structures");
const { Photo, Structure, sequelize } = require("../../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await sequelize.transaction(async (t) => {
      const structureNames = structures.map((s) => s.name);
      const structureValidate = await Structure.findAll({
        where: {
          name: structureNames,
        },
      });

      const structureFilter = structures
        .filter((s) => !!!structureValidate.find((f) => f.name === s?.name))
        .filter((s) => s);

      if (structureFilter.length > 1) {
        const photoPromiseAll = structureFilter.map((s) => {
          const url = s.image;
          delete s.image;
          return Photo.create(
            {
              // id: uuidv4(),
              url: url,
              category: PhotoEnum.CATEGORY.THUMBNAIL,
              type: PhotoEnum.TYPE.LOCAL,
              // created_at: new Date(),
              // updated_at: new Date(),
              structure: {
                name: s.name
              },
            },
            {
              include: {
                model: Structure,
                as: "structure",
              },
              transaction: t,
            }
          );
        });
        await Promise.all(photoPromiseAll);
      }
    });
  },

  async down(queryInterface, Sequelize) {
    const structureAll = await Structure.findAll();
    if (structureAll?.length < 1) {
      return null;
    }
    const photoIds = structureAll.map((s) => s.photo_id);
    await Photo.destroy({
      where: {
        id: photoIds,
      },
    });
    return await queryInterface.bulkDelete("structures", null, {});
  },
};
