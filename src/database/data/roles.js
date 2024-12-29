const { v4: uuidv4 } = require("uuid");

module.exports = [
  {
    id: uuidv4(),
    name: "Super admin",
    created_at: new Date(),
    updated_at: new Date(),
  },
];
