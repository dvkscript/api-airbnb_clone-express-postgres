const Repository = require("../../core/repository");
const { UserToken } = require("../models");

class BlackListRepository extends Repository {
  getModel() {
    return UserToken;
  }
}

module.exports = new BlackListRepository();
