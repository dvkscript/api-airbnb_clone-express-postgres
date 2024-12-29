const Repository = require("../../core/repository");
const { BlackList } = require("../models");

class BlackListRepository extends Repository {
  getModel() {
    return BlackList;
  }
};

const blackListRepository = new BlackListRepository();


module.exports = blackListRepository;
