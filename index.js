import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import config from "./config/config.js";
import router from "./routes/index.js";
import db from "./models/index.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import createSocketServer from "./config/socket.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "chat.html"));
});

// Create a single HTTP server for both Express and Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with your config (optionally pass CORS)
export const socketConfig = createSocketServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

server.listen(port, async () => {
  console.log("Server is running on port", port);
  await db.sequelize
    .authenticate()
    .then(async () => {
      console.log("Database connected.");
    })
    .catch((err) => {
      console.error("Database connection failed!", err);
    });
});

export default app;
