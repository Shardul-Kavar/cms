import { Sequelize } from "sequelize";
import config from "./config.js";

const { host, name, password, port, user } = config.db;

const sequelizeConfig = new Sequelize(name, user, password, {
  host,
  port,
  dialect: "postgres",
  username: user,
  password,
});

export default sequelizeConfig;
