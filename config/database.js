import { Sequelize } from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize(
  `${config.db.type}://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`,
  {
    dialect: config.db.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

export default sequelize;
