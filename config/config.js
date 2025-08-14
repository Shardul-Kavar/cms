import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || "host",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || "name",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
  },
};

export default config;
