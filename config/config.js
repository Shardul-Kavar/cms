import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  db: {
    type: process.env.DB_TYPE || "postgres",
    dialect: process.env.DB_DIALECT || "postgres",
    host: process.env.DB_HOST || "host",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || "name",
    username: process.env.DB_USER || "username",
    password: process.env.DB_PASSWORD || "password",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },
};

export default config;
