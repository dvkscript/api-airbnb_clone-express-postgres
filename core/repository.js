//Base Repository
const { v4: uuidv4 } = require("uuid");

class Repository {
  constructor() {
    this.model = this.getModel();
  }
  create(data, condition = {}) {
    return this.model.create(data, condition);
  }
  update(data, condition = {}) {
    return this.model.update(data, condition);
  }
  updateByPk(data, id) {
    return this.model.update(data, {
      where: { id },
    });
  }
  delete(condition = {}) {
    return this.model.destroy({ ...condition });
  }
  deleteByPk(id) {
    return this.model.destroy({ where: { id } });
  }
  findAll(options = {}) {
    return this.model.findAll(options);
  }
  findOne(options = {}) {
    return this.model.findOne(options);
  }
  findByPk(id, options = {}) {
    return this.model.findByPk(id, options);
  }
  findOrCreate(data = {}, condition = {}) {
    return this.model.findOrCreate({
      ...condition,
      defaults: data,
    });
  }
  findAndCountAll(condition = {}) {
    return this.model.findAndCountAll(condition);
  }
  bulkCreate(data = [], condition = {}) {
       return this.model.bulkCreate(data, condition);
  }
}

module.exports = Repository;