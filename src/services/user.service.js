const userRepository = require("../repositories/user.repository");
const userWishlistRepository = require("../repositories/user_wishlist.resository");
const roomRepository = require("../repositories/room.repository");
const ProfileTransformer = require("../transformers/profile.transformer");
const resUtil = require("../utils/res.util");
const { sequelize } = require("../models");

class UserService {
  #user = userRepository;
  #userWishlist = userWishlistRepository;
  #room = roomRepository;

  getUser(where, option = {}) {
    return this.#user.getUser(where, option);
  }
  getUserPermissions(where, option = {}) {
    return this.#user.getUserPermissions(where, option);
  }
  getUserByPk(userId) {
    return this.#user.findByPk(userId);
  }
  async getUserProfile(where) {
    const user = await this.#user.getUserProfile(where);
    if (!user) {
      throw new resUtil.CatchError({
        status: 404,
        message: "User not found",
      });
    }
    return new ProfileTransformer(user);
  }
  getWishlists(userId) {
    return this.#userWishlist.getWishlistsByUser(userId);
  }
  async createWishlist(userId, name) {
    return await sequelize.transaction(async (transaction) => {
      const [wishlist, wishlistCreated] =
        await this.#userWishlist.getWishlistOrCreate(
          {
            name,
            user_id: userId,
          },
          {
            name,
          },
          {
            transaction,
          }
        );
      if (!wishlist) {
        throw new resUtil.CatchError({
          status: 500,
          message: "Server error",
        });
      }
      if (!wishlistCreated) {
        throw new resUtil.CatchError({
          status: 400,
          message: "Wishlist name already exists",
        });
      }

      return wishlist;
    });
  }
  async wishlistAddOrRemoveRoom(userId, body) {
    return await sequelize.transaction(async (transaction) => {
      const { wishlistId, roomId, action } = body;
      const [wishlist, room] = await Promise.all([
        this.#userWishlist.findOne({
          where: {
            id: wishlistId,
            user_id: userId,
          },
        }),
        this.#room.findByPk(roomId),
      ]);

      if (!wishlist) {
        throw new resUtil.CatchError({
          status: 404,
          message: "Wishlist not fount",
        });
      }
      if (!room) {
        throw new resUtil.CatchError({
          status: 404,
          message: "Room not fount",
        });
      }

      switch (action) {
        case "add":
          const roomWishlists = await room.getWishlists({
            where: {
              user_id: userId,
            },
          });
          if (!roomWishlists) {
            throw new resUtil.CatchError({
              status: 500,
              message: "Server error",
            });
          }
          if (roomWishlists.length > 0) {
            const ids = roomWishlists.map((rw) => rw.id);
            await room.removeWishlist(ids, { transaction });
          }
          await room.addWishlist(wishlist, { transaction });
          break;

        case "remove":
          await room.removeWishlist(wishlist, { transaction });
          break;

        default:
          break;
      }
      return wishlist;
    });
  }
}

module.exports = new UserService();
