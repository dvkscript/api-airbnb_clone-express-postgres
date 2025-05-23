const pg = require("pg");
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: process.env.POSTGRES_DIALECT || "postgres",
    dialectOptions: {
      ssl: process.env.NODE_ENV === "development"
        ? false
        : {
            require: true,
          },
    },
    dialectModule: pg,
  },
  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: process.env.POSTGRES_DIALECT || "postgres",
    dialectOptions: {
      ssl: process.env.NODE_ENV === "development"
        ? false
        : {
            require: true,
          },
    },
    dialectModule: pg,
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: process.env.POSTGRES_DIALECT || "postgres",
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg,
  },
};
