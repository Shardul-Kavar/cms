import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";

import Customer from "./customer.js";
import User from "./user.js";
import Job from "./job.js";

const db = {};
db.Sequelize = Sequelize;

db.Customer = Customer(sequelize);
db.User = User(sequelize);
db.Job = Job(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database and tables synced.");
  })
  .catch((err) => {
    console.error("Error syncing databse!", err);
  });

db.sequelize = sequelize;

export default db;
