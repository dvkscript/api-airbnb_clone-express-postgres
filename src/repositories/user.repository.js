const Repository = require("../../core/repository");
const {
  User,
  Role,
  Permission,
  Profile,
  Photo,
} = require("../models");

class UserRepository extends Repository {
  getModel() {
    return User;
  }
  getUser(where, option = {}) {
    return this.findOne({
      attributes: {
        exclude: ["password"],
      },
      ...option,
      where,
    });
  }
  getUserPermissions(where, option = {}) {
    return this.findOne({
      required: true,
      attributes: {
        exclude: ["password"],
      },
      ...option,
      where,
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["name"],
          through: {
            attributes: [],
          },
          include: {
            model: Permission,
            as: "permissions",
            attributes: ["value"],
            through: {
              attributes: [],
            },
          },
        },
        {
          model: Permission,
          as: "permissions",
          attributes: ["value"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }
  getUserOrCreate(data, where, option = {}) {
    return this.findOrCreate(data, {
      ...option,
      where,
    });
  }
  getUserProfile(where, option = {}) {
    return this.findOne({
      required: true,
      attributes: {
        exclude: ["password"],
      },
      ...option,
      where,
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["name"],
          through: {
            attributes: [],
          },
          include: {
            model: Permission,
            as: "permissions",
            attributes: ["value"],
            through: {
              attributes: [],
            },
          },
        },
        {
          model: Permission,
          as: "permissions",
          attributes: ["value"],
          through: {
            attributes: [],
          },
        },
        {
          model: Profile,
          as: "profile",
          attributes: {
            exclude: ["user_id"],
          },
          include: {
            model: Photo,
            as: "thumbnail",
          },
        },
      ],
    });
  }
}

module.exports = new UserRepository();
