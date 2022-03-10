import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "940330", {
  host: 'localhost',
  port: 5432,
  dialect: "postgres",
});

module.exports = sequelize;