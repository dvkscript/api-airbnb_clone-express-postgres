const Repository = require("../../core/repository");
const { Provider } = require("../models");

class ProviderRepository extends Repository {
  getModel() {
    return Provider;
  }
  getProviderOrCreate(data, where, options = {}) {
    return this.findOrCreate(data, {
      ...options,
      where,
    });
  }
}

module.exports = new ProviderRepository();
