const userTokenRepository = require("../repositories/userToken.repository");

class UserTokenService {
    #repository = userTokenRepository;

  async getUserToken (refresh_token) {
    return await this.#repository.findOne({
      where: {
        refresh_token,
      },
    });
  }
  deleteUserToken(refresh_token, user_id) {
    return this.#repository.delete({
      where: {
        refresh_token,
        user_id
      }
    })
  }
};

module.exports = new UserTokenService();