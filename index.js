import express from "express";
import cors from "cors";
import helmet from "helmet";
import sequelize from "./config/database.js";
import config from "./config/config.js";
import router from "./routes/index.js";
import db from "./models/index.js";

const app = express();
const port = config.port;

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: true,
  })
);

app.use(express.json());
app.use(express.urlencoded());

app.use("/api", router);
app.use("/", (req, res) => {
  console.log("Welcome to the CMS backend!");
  res.status(200).send("Welcome to the CMS backend!");
});

app.listen(port, async () => {
  console.log("Server is running on port", port);
  await db.authenticate();
});

export default app;
