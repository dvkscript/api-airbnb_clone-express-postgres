const Repository = require("../../core/repository");
const { RoomFloorPlan } = require("../models");

class RoomFloorPlanRepository extends Repository {
    getModel() {
        return RoomFloorPlan;
    }
    getFloorPlan(where, option = {}) {
        return this.findOne({
            ...option,
            where
        })
    }
}

module.exports = new RoomFloorPlanRepository();
