const Repository = require("../../core/repository");
const { Photo } = require("../models");

class PhotoRepository extends Repository {
  getModel() {
    return Photo;
  }
  createPhoto(data, option = {}) {
    return this.create(data, option)
  }
  getPhotos(where, option = {}) {
    return this.findAll({
      ...option,
      where,
    })
  }
}

module.exports = new PhotoRepository();
