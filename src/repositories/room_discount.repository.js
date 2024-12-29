const Repository = require("../../core/repository");
const { RoomDiscount } = require("../models");

class RoomDiscountRepository extends Repository {
    getModel() {
        return RoomDiscount;
    }
    createDiscounts(data, option = {}) {
        return this.bulkCreate(data, option)
    }
    deleteDiscounts(room_id, option = {}) {
        return this.delete({
            ...option,
            where: {
                room_id
            }
        })
    }
}

module.exports = new RoomDiscountRepository();
