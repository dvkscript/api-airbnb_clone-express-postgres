const structureRepository = require("../repositories/structure.repository");
const ListStructureTransformer = require("../transformers/list.structure.transformer")

class StructureService {
  #repository = structureRepository;

  constructor() {}

  async getStructureAndCountAll(query) {
    const result = await this.#repository.getStructureAndCountAll(query);
    if (!result) return null;

    return {
        count: result.count,
        rows: new ListStructureTransformer(result.rows)
    }
  }
  getStructure(where, option = {}) {
    return this.#repository.findOne({
      ...option,
      where,
    })
  }
};

module.exports = new StructureService();