const { v4: uuidv4 } = require("uuid");
const Permission = require("../../enums/permission");
module.exports = Object.keys(Permission).map((key) => ({
  id: uuidv4(),
  value: Permission[key],
  created_at: new Date(),
  updated_at: new Date(),
}));
