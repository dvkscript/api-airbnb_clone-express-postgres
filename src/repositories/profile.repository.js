const Repository = require("../../core/repository");
const { Profile } = require("../models");

class ProfileRepository extends Repository {
  getModel() {
    return Profile;
  }
  getProfile(where, option = {}) {
    return this.findOne({
      ...option,
      where
    })
  } 
  getProfileByPk(profileId, option = {}) {
    return this.findByPk(profileId, {
      ...option,
    })
  }
}

module.exports = new ProfileRepository();
