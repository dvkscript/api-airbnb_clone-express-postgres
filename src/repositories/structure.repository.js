const { Op } = require("sequelize");
const Repository = require("../../core/repository");
const { Structure, Photo } = require("../models");

class StructureRepository extends Repository {
  getModel() {
    return Structure;
  }
  getStructureAndCountAll(query = {}, option = {}) {
    const { q, limit, page, order, sort } = query;

    const options = {
      ...option,
      order: [["created_at", order]],
      include: {
        model: Photo,
        as: "photo",
      },
    };

    if (limit !== "all") {
      options.limit = limit;
      options.offset = (+page - 1) * +limit;
    }

    if (sort && sort !== "created_at") {
      options.order = options.order.push([sort, order]);
    }

    if (q) {
      options.where = {
        name: {
          [Op.iLike]: `%${q}%`,
        },
      };
    }
    return this.findAndCountAll(options);
  }
}

module.exports = new StructureRepository();
