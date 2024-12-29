const Repository = require("../../core/repository");
const { UserWishlist, Room, RoomPhoto, Photo } = require("../models");

class UserWishlistRepository extends Repository {
  getModel() {
    return UserWishlist;
  }
  getWishlistsByUser(user_id, where = {}, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...where,
        user_id,
      },
      include: [
        {
          model: Room,
          as: "rooms",
          through: {
            attributes: [],
          },
          include: {
            model: RoomPhoto,
            as: "photos",
            where: {
              position: 0,
            },
            include: {
              model: Photo,
              as: "photo",
            },
          },
        },
      ],
    });
  }
  createWishlist(name, option = {}) {
    return this.create(
      {
        name,
      },
      option
    );
  }
  getWishlistOrCreate(data, where, option = {}) {
    return this.findOrCreate(data, {
      ...option,
      where,
    });
  }
}

module.exports = new UserWishlistRepository();
