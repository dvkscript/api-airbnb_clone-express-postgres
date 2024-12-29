const Repository = require("../../core/repository");
const { Permission } = require("../models");

class PermissionRepository extends Repository {
  getModel() {
    return Permission;
  }
}

module.exports = new PermissionRepository();
