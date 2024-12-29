const amenityRepository = require('../repositories/amenity.repository');

class AmenityService {
    #repository = amenityRepository;
    constructor(repository) {}

    async getAmenityAndCountAll(query) {
        return await this.#repository.getAmenityAndCountAll(query);
    }
}

module.exports = new AmenityService();