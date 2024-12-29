const blackListRepository = require("../repositories/blacklist.repository");

module.exports = {
  getBlackListByToken: async (token) => {
    return await blackListRepository.findOne({
      where: {
        token,
      },
    });
  },
  createBlackList: async (token, expired) => {
    return await blackListRepository.create({
      token,
      expired
    })
  }
};
