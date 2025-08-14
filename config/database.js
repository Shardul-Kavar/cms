import { Sequelize } from "sequelize";
import config from "./config.js";

const sequelizeConfig = new Sequelize(
  `postgresql://postgres.pzmwvrmhvhvimtooocmv:${config.db.password}@aws-1-ap-southeast-1.pooler.supabase.com:${config.db.port}/${config.db.name}`,
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

export default sequelizeConfig;
