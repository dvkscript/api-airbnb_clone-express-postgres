const { Op } = require("sequelize");
const Repository = require("../../core/repository");
const PhotoEnum = require("../enums/photo");
const {
  Room,
  Structure,
  Photo,
  Address,
  Amenity,
  Fee,
  RoomDiscount,
  RoomFloorPlan,
  RoomPhoto,
  User,
  UserWishlist,
  Profile,
} = require("../models");
const { RoomStatus } = require("../enums/room");

class RoomRepository extends Repository {
  getModel() {
    return Room;
  }

  getUserRoomAndCountAll(user_id, query, option = {}) {
    const { q, limit, page, order, sort, statusText } = query ?? {};
    const options = {
      ...option,
      order: [["created_at", order]],
      where: {
        user_id,
      },
      include: [
        {
          model: RoomPhoto,
          as: "photos",
          order: [["position", "ASC"]],
          include: {
            model: Photo,
            as: "photo",
          },
          where: {
            position: 0,
          },
          separate: true,
        },
        {
          model: Address,
          as: "address",
        },
      ],
    };
    if (limit !== "all") {
      options.limit = limit;
      options.offset = (page - 1) * +limit;
    }

    if (sort && sort !== "created_at") {
      options.order = options.order.push([sort, order]);
    }

    if (q || statusText) {
      options.where = {
        [Op.and]: [],
        ...options.where,
      };
    }

    if (q) {
      options.where[Op.and].push({
        [Op.or]: {
          title: {
            [Op.iLike]: `%${q}%`,
          },
        },
      });
    }
    if (statusText) {
      options.where[Op.and].push({
        statusText: { [Op.iLike]: `%${statusText}%` },
      });
    }
    return this.findAndCountAll(options);
  }

  getRoomAndCountAll(query, currentUserId, option = {}) {
    const { q, limit, page, order, sort, structure } = query;
    const options = {
      ...option,
      order: [["created_at", order]],
      where: {
        [Op.and]: [
          {
            statusText: RoomStatus.AVAILABLE,
          },
        ],
      },
      include: [
        {
          model: RoomPhoto,
          as: "photos",
          order: [["position", "ASC"]],
          include: {
            model: Photo,
            as: "photo",
          },
          separate: true,
        },
      ],
    };
    if (limit !== "all") {
      options.limit = limit;
      options.offset = (page - 1) * +limit;
    }

    if (sort && sort !== "created_at") {
      options.order = options.order.push([sort, order]);
    }

    const includeAddress = {
      model: Address,
      as: "address",
    };

    if (q) {
      const keywords = q.split(",").map((word) => word.trim());
      const fields = [
        "extras",
        "street",
        "district",
        "province",
        "country",
        "country_code",
      ];

      includeAddress.where = {
        [Op.or]: fields.map((field) => ({
          [field]: {
            [Op.or]: keywords.map((keyword) => ({
              [Op.iLike]: `%${keyword}%`,
            })),
          },
        })),
      };
    }
    // options.where[Op.and].push({
    //   [Op.or]: {
    //     title: {
    //       [Op.iLike]: `%${q}%`,
    //     },
    //     description: {
    //       [Op.iLike]: `%${q}%`,
    //     },
    //   },
    // });

    const includeStructure = {
      model: Structure,
      as: "structure",
    };

    if (structure) {
      includeStructure.where = {
        name: {
          [Op.iLike]: `%${structure}%`,
        },
      };
    }

    options.include.push(includeStructure);
    options.include.push(includeAddress);

    if (currentUserId) {
      options.include.push({
        model: UserWishlist,
        as: "wishlists",
        required: false,
        include: {
          model: User,
          as: "users",
          required: false,
          where: {
            id: currentUserId,
          },
          attributes: [],
        },
      });
    }

    return this.findAndCountAll(options);
  }

  createRoom({ name, description, original_price = 0, user_id }, option = {}) {
    return this.create(
      {
        name,
        description,
        original_price,
        user_id,
      },
      option
    );
  }

  getUserRoom(user_id, where = {}, option = {}) {
    return this.findOne({
      required: true,
      ...option,
      where: {
        ...where,
        user_id,
      },
      include: [
        {
          model: Structure,
          as: "structure",
          include: {
            model: Photo,
            as: "photo",
          },
        },
        {
          model: Amenity,
          as: "amenities",
          through: { attributes: [] },
          include: {
            model: Photo,
            as: "photo",
          },
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: Fee,
          as: "fee",
        },
        {
          model: RoomPhoto,
          as: "photos",
          order: [["position", "ASC"]],
          include: {
            model: Photo,
            as: "photo",
          },
          separate: true,
        },
        {
          model: RoomDiscount,
          as: "discounts",
          attributes: {
            exclude: ["room_id"],
          },
        },
        {
          model: RoomFloorPlan,
          as: "floorPlan",
          attributes: {
            exclude: ["room_id"],
          },
        },
      ],
    });
  }
  getRooms(where = {}, option = {}) {
    return this.findAll({
      ...option,
      where,
    });
  }
  deleteRooms(ids, option = {}) {
    return this.delete({
      ...option,
      where: {
        id: ids,
      },
    });
  }
  getRoomsPhotoClouds(where, option = {}) {
    return this.findAll({
      ...option,
      where,
      include: {
        model: RoomPhoto,
        as: "photos",
        required: false,
        include: {
          model: Photo,
          as: "photo",
          required: true,
          where: {
            type: PhotoEnum.TYPE.CLOUD,
          },
        },
      },
    });
  }
  getRoomDetail(where, option = {}) {
    const { currentUserId, ...rest } = option;

    const include = [
      {
        model: User,
        as: "user",
        attributes: ["full_name"],
        include: [
          {
            model: Room,
            as: "rooms",
            required: false,
            attributes: ["created_at"],
            order: [["created_at", "ASC"]],
          },
          {
            model: Profile,
            as: "profile",
            attributes: ["created_at"],
            include: {
              model: Photo,
              as: "thumbnail",
            },
          },
        ],
      },
      {
        model: Structure,
        as: "structure",
        include: {
          model: Photo,
          as: "photo",
        },
      },
      {
        model: Amenity,
        as: "amenities",
        attributes: ["id"],
      },
      {
        model: Address,
        as: "address",
      },
      {
        model: Fee,
        as: "fee",
      },
      {
        model: RoomPhoto,
        as: "photos",
        order: [["position", "ASC"]],
        include: {
          model: Photo,
          as: "photo",
        },
        separate: true,
      },
      {
        model: RoomDiscount,
        as: "discounts",
        attributes: {
          exclude: ["room_id"],
        },
      },
      {
        model: RoomFloorPlan,
        as: "floorPlan",
        attributes: {
          exclude: ["room_id"],
        },
      },
    ];

    if (currentUserId) {
      include.push({
        model: UserWishlist,
        as: "wishlists",
        required: false,
        include: {
          model: User,
          as: "users",
          required: false,
          where: {
            id: currentUserId,
          },
          attributes: [],
        },
      });
    }

    return this.findOne({
      ...rest,
      where,
      include,
    });
  }
}

module.exports = new RoomRepository();
