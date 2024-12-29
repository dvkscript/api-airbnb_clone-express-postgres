const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { fakerVI } = require("@faker-js/faker");

module.exports = [
  {
    id: uuidv4(),
    full_name: "Anh Khoa",
    email: "khoa@gmail.com",
    password: bcrypt.hashSync("@Khoaadmin1", 10),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    full_name: "Anh Khoa",
    email: "mr.khoacoding@gmail.com",
    password: bcrypt.hashSync("@Khoaadmin1", 10),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: uuidv4(),
    full_name: "Anh Test",
    email: "test@gmail.com",
    password: bcrypt.hashSync("testtest", 10),
    created_at: new Date(),
    updated_at: new Date(),
  },
  ...Array.from({ length: 50 }).map((_, index) => ({
    id: uuidv4(),
    full_name: fakerVI.internet.displayName(),
    email: fakerVI.internet.email(),
    password: bcrypt.hashSync(`text-index-${index}`, 10),
    created_at: new Date(),
    updated_at: new Date(),
  })),
];
