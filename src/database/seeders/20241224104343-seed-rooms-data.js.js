"use strict";
const { RoomStatus, PRIVACY_TYPE } = require("../../enums/room");
const {
  User,
  Room,
  Structure,
  Amenity,
  Fee,
  Address,
  RoomFloorPlan,
  RoomPhoto,
  Photo,
} = require("../../models");
const { fakerVI, faker } = require("@faker-js/faker");
const PhotoEnum = require("../../enums/photo");
const { default: axios } = require("axios");

function getRandomInRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

// Tọa độ Việt Nam
const minLatitude = 8.1; // Vĩ độ thấp nhất của Việt Nam
const maxLatitude = 23.4; // Vĩ độ cao nhất của Việt Nam
const minLongitude = 102.1; // Kinh độ thấp nhất của Việt Nam
const maxLongitude = 109.5; // Kinh độ cao nhất của Việt Nam

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users, roomCount, structures, amenities, fees] = await Promise.all([
      User.findAll(),
      Room.count(),
      Structure.findAll(),
      Amenity.findAll(),
      Fee.findAll(),
    ]);

    if (roomCount > 100) {
      return;
    }

    let roomLength = 0;
    let photoPage = 0;
    for (const [structureIndex, structure] of structures.entries()) {
      if (structureIndex % 2 === 0) {
        photoPage++;
      }

      const photoResponse = await axios.get(
        `https://unsplash.com/ngetty/v3/search/images/creative?exclude_editorial_use_only=true&exclude_nudity=true&fields=display_set%2Creferral_destinations%2Ctitle&graphical_styles=photography&page_size=${100}&phrase=${
          structureIndex % 2 === 0 ? "house" : "room"
        }&page=${photoPage}`
      );

      const photos = photoResponse.data.images;

      for (let index = 0; index < 20; index++) {
        roomLength++;
        const userIndex = parseInt(getRandomInRange(0, users.length - 1));
        const user = users[userIndex];
        const location = fakerVI.location;

        const randomLatitude = getRandomInRange(minLatitude, maxLatitude);
        const randomLongitude = getRandomInRange(minLongitude, maxLongitude);

        const address = {
          lat: randomLatitude,
          lng: randomLongitude,
          country: location.country(),
          country_code: "VN",
          postal_code: location.zipCode(),
          province: location.city(),
          district: location.county(),
          street: location.street(),
          extras: location.streetAddress(),
          created_at: new Date(),
          updated_at: new Date(),
        };

        const roomData = {
          title: `${fakerVI.commerce.productAdjective()} ${fakerVI.commerce
            .productMaterial()
            .toLowerCase()}`,
          description: fakerVI.commerce.productDescription(),
          statusText: RoomStatus.AVAILABLE,
          original_price: parseInt(getRandomInRange(21, 200)),
          instant_book: true,
          privacy_type:
            structureIndex % 2 === 0 ? PRIVACY_TYPE.ENTIRE : PRIVACY_TYPE.ROOM,
        };

        const floorPlan = {
          guests: 16,
          bedrooms: 4,
          beds: 4,
          bathrooms: 4,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const photoPromiseAll = await Promise.all(
          Array.from({ length: 5 }).map((_, i) => {
            const photoIndex = index * 5 + i;

            return Photo.create({
              category: PhotoEnum.CATEGORY.ROOM,
              url: photos[photoIndex].display_sizes[
                photos[photoIndex].display_sizes.length - 1
              ].uri,
              type: PhotoEnum.TYPE.URL,
            });
          })
        );

        const room = await Room.create(
          {
            ...roomData,
            user_id: user.id,
            structure_id: structure.id,
            address: address,
            fee_id: fees[0].id,
            floorPlan,
          },
          {
            include: [
              {
                model: Address,
                as: "address",
              },
              {
                model: RoomFloorPlan,
                as: "floorPlan",
              },
            ],
          }
        );

        await Promise.all(
          photoPromiseAll.map((photo, index) =>
            RoomPhoto.create({
              room_id: room.id,
              photo_id: photo.id,
              position: index,
              created_at: new Date(),
              updated_at: new Date(),
            })
          )
        );
        console.log("room created: ", roomLength);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    return await Room.destroy();
  },
};
