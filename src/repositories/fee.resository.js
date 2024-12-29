const Repository = require("../../core/repository");
const { Fee } = require("../models");

class FeeRepository extends Repository {
    getModel() {
        return Fee;
    }
    getFee(where, options = {}) {
        return this.findOne({
            ...options,
            where
        })
    }
}

module.exports = new FeeRepository();
