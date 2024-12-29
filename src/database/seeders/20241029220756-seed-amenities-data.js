'use strict';
const { Photo, sequelize, Amenity} = require("../../models");
const amenities = require("../data/amenities")
const PhotoEnum = require("../../enums/photo");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await sequelize.transaction(async (t) => {
      const amenityNames = amenities.map((a) => a.name);
      const amenityValidate = await Amenity.findAll({
        where: {
          name: amenityNames,
        },
      });

      const amenityFilter = amenities.filter((f) => !!!amenityValidate.find((a) => f.name === a.name)).filter(a => a);
      if (amenityFilter.length > 1) {
        const photoPromiseAll = amenityFilter.map(a => {
          const url = encodeURI(a.image);
          delete a.image;
          return Photo.create({
                url: url,
                category: PhotoEnum.CATEGORY.THUMBNAIL,
                type: PhotoEnum.TYPE.LOCAL,
                amenity: {
                  name: a.name,
                  category: a.category,
                },
              },
              {
                include: {
                  model: Amenity,
                  as: "amenity",
                },
                transaction: t,
              })
        });
        await Promise.all(photoPromiseAll);
      }
    })
  },

  async down (queryInterface, Sequelize) {
    const amenityAll = await Amenity.findAll();
    if (amenityAll?.length < 1) {
      return null;
    }
    const photoIds = amenityAll.map((a) => a.photo_id);
    await Photo.destroy({
      where: {
        id: photoIds,
      },
    });
    return await queryInterface.bulkDelete("amenities", null, {});
  }
};
