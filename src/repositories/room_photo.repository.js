const Repository = require("../../core/repository");
const { RoomPhoto, Photo } = require("../models");
const { v4: uuid } = require("uuid")

class RoomPhotoRepository extends Repository {
    getModel() {
        return RoomPhoto;
    }
    getRoomPhotos(where, option = {}) {
        return this.findAll({
            ...option,
            where,
            include: {
                model: Photo,
                as: "photo"
            }
        })
    }
    createRoomPhoto(data, option = {}) {
        return this.create(data, {
            ...option,
        })
    }
    createRoomPhotos(data = [], option = {}) {
        return this.bulkCreate(data, {
            ...option,
        })
    }
}

module.exports = new RoomPhotoRepository();
