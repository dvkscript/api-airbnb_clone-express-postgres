const { sequelize } = require("../models");
const roomRepository = require("../repositories/room.repository");
const resUtil = require("../utils/res.util");
const structureService = require("./structure.service");
const roomFloorPlanRepository = require("../repositories/room_floor_plan.repository");
const amenityRepository = require("../repositories/amenity.repository");
const roomPhotoRepository = require("../repositories/room_photo.repository");
const photoRepository = require("../repositories/photo.repository");
const feeRepository = require("../repositories/fee.resository");
const RoomDiscountRepository = require("../repositories/room_discount.repository");
const photoService = require("./photo.service");

class RoomService {
  #repository = roomRepository;
  #photoRepository = photoRepository;
  #fee = feeRepository;
  #discountRepository = RoomDiscountRepository;

  getRoomAndCountAllByUserId(user_id, query) {
    return this.#repository.getUserRoomAndCountAll(user_id, query);
  }

  async getRoomAndCountAll(query, currentUserId) {
    return await this.#repository.getRoomAndCountAll({
      ...query,
    }, currentUserId);
  }

  createUserRoom(user_id, body = {}) {
    return this.#repository.create({
      ...body,
      user_id,
    });
  }

  async getUserRoomById(user_id, room_id) {
    return await this.#repository.getUserRoom(user_id, {
      id: room_id,
    });
  }

  async updateUserRoom(user_id, room_id, body) {
    return await sequelize.transaction(async (t) => {
      const {
        structure_id,
        address,
        amenity_id,
        photos,
        discounts,
        floorPlan,
        ...rest
      } = body;

      const room = await this.#repository.getUserRoom(
        user_id,
        {
          id: room_id,
        },
        {
          transaction: t,
        }
      );

      if (!room) {
        throw new resUtil.CatchError({
          status: 404,
          message: "Room not found",
        });
      }

      const updatePromiseAll = [];

      if (structure_id) {
        const structure = await structureService.getStructure(
          {
            id: structure_id,
          },
          {
            transaction: t,
          }
        );
        if (!structure) {
          throw new resUtil.CatchError({
            status: 404,
            message: "Structure not found",
          });
        }
        updatePromiseAll.push(
          room.setStructure(structure.id, {
            transaction: t,
          })
        );
      }

      if (Array.isArray(amenity_id)) {
        if (amenity_id.length > 0) {
          const amenityValidate = await amenityRepository.findAll({
            where: {
              id: amenity_id,
            },
          });
          if (amenityValidate?.length !== amenity_id.length) {
            throw new resUtil.CatchError({
              status: 500,
              message: "Update amenity failed",
            });
          }
        }
        updatePromiseAll.push(
          room.setAmenities(amenity_id, {
            transaction: t,
          })
        );
      }

      if (Array.isArray(photos) && photos.length > 0) {
        const photoIds = photos.map((p) => p.id);
        const [validatedPhotos, roomPhotos] = await Promise.all([
          this.#photoRepository.getPhotos(
            {
              id: photoIds,
            },
            {
              raw: true,
            }
          ),
          room.getPhotos({
            raw: true,
          }),
        ]);

        if (!Array.isArray(validatedPhotos) || !Array.isArray(roomPhotos)) {
          throw new resUtil.CatchError({
            status: 500,
            message: "server error",
          });
        }

        const updatedPhotosMap = new Map();
        validatedPhotos.forEach((photo) => {
          const foundPhoto = photos.find((f) => f.id === photo.id);
          updatedPhotosMap.set(photo.id, {
            photo_id: photo.id,
            room_id,
            position:
              typeof foundPhoto?.position === "number"
                ? foundPhoto.position
                : null,
          });
        });

        const mergedPhotos = roomPhotos.map((roomPhoto) => {
          const foundUpdatedPhoto = updatedPhotosMap.get(roomPhoto.photo_id);
          if (foundUpdatedPhoto) {
            return {
              ...roomPhoto,
              position:
                typeof foundUpdatedPhoto.position === "number"
                  ? foundUpdatedPhoto.position
                  : roomPhoto.position,
              updated_at: new Date(),
            };
          }

          return roomPhoto;
        });
        mergedPhotos.push(...Array.from(updatedPhotosMap.values()));

        const uniquePhotos = Array.from(
          new Set(mergedPhotos.map((photo) => photo.photo_id))
        ).map((id) => mergedPhotos.find((photo) => photo.photo_id === id));

        const sortedPhotos = uniquePhotos
          .sort((a, b) => {
            if (typeof a.position !== "number") return 1;
            if (typeof b.position !== "number") return -1;
            return a.position - b.position;
          })
          .map((p, i) => ({ ...p, position: i }));

        updatePromiseAll.push(
          roomPhotoRepository.bulkCreate(sortedPhotos, {
            transaction: t,
            updateOnDuplicate: ["position", "updated_at"],
          })
        );
      }

      if (address) {
        const countryCode = address.country_code;
        let fee = await this.#fee.getFee({
          country_code: countryCode,
        });
        if (!fee) {
          fee = await this.#fee.getFee({ country_code: "VN" });
          if (!fee) {
            throw new resUtil.CatchError({
              status: 500,
              message: "Server error",
            });
          }
        }
        updatePromiseAll.push(
          room.setFee(fee.id, {
            transaction: t,
          })
        );
        if (!room.address_id) {
          updatePromiseAll.push(
            room.createAddress(address, {
              transaction: t,
            })
          );
        } else {
          const addressInstance = await room.getAddress();
          if (!addressInstance) {
            throw new resUtil.CatchError({
              status: 500,
              message: "update address error",
            });
          }
          updatePromiseAll.push(
            addressInstance.update(address, {
              transaction: t,
            })
          );
        }
      }

      if (discounts) {
        if (room.discounts.length > 1) {
          await this.#discountRepository.deleteDiscounts(room_id, {
            transaction: t,
          });
        }
        updatePromiseAll.push(
          this.#discountRepository.createDiscounts(
            discounts.map((d) => ({ ...d, room_id })),
            {
              transaction: t,
            }
          )
        );
      }

      if (floorPlan) {
        if (!!room.floorPlan) {
          const floorPlan = await roomFloorPlanRepository.findOne({
            id: room.floorPlan.id,
          });
          if (!floorPlan) {
            throw new resUtil.CatchError({
              status: 404,
              message: "Floor Plan not found",
            });
          }
          updatePromiseAll.push(
            floorPlan.update(floorPlan, {
              transaction: t,
            })
          );
        } else {
          updatePromiseAll.push(
            room.createFloorPlan(floorPlan, {
              transaction: t,
            })
          );
        }
      }

      if (Object.keys(rest).length > 0) {
        updatePromiseAll.push(
          room.update(
            {
              ...rest,
            },
            {
              transaction: t,
            }
          )
        );
      }
      await Promise.all(updatePromiseAll);
      return {
        id: room.id,
      };
    });
  }
  async deleteUserRooms(user_id, ids) {
    return await sequelize.transaction(async (transaction) => {
      const rooms = await this.#repository.getRoomsPhotoClouds(
        {
          user_id,
          id: ids,
        },
        { transaction }
      );
      if (!rooms) {
        throw new resUtil.CatchError({
          status: 500,
          message: "Server error",
        });
      }
      if (rooms?.length < 1) {
        throw new resUtil.CatchError({
          status: 404,
          message: "room not found",
        });
      }
      const photos = rooms.flatMap((r) => r.photos);
      if (photos.length > 0) {
        const photoIds = photos.map((p) => p.photo.id);
        await photoService.deletePhoto(photoIds);
      }
      const roomIds = rooms.map((r) => r.id);
      return await this.#repository.deleteRooms(roomIds, { transaction });
    });
  }
  getRoomDetails(roomId, currentUserId) {
    return this.#repository.getRoomDetail(
      {
        id: roomId,
      },
      {
        currentUserId,
      }
    );
  }
  getRoomById(roomId) {
    return this.#repository.findByPk(roomId);
  }
}

module.exports = new RoomService();
