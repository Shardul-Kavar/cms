import { Sequelize } from "sequelize";
import sequelizeConfig from "../config/database.js";

const db = {};

db.sequelize = sequelizeConfig;
db.Sequelize = Sequelize;

db.authenticate = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed!", err);
  }
};

export default db;
