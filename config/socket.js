// config/socket.js
import { Server } from "socket.io";
import helper from "../utils/helper.js";

const DEFAULT_CORS = { origin: "*" };

let io;
const createSocketServer = (httpServer, { cors = DEFAULT_CORS } = {}) => {
  io = new Server(httpServer, {
    cors,
    // transports: ["websocket"],
  });

  // Auth middleware (replace with real JWT verification)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers?.authorization?.split(" ")?.[1];

      const user = helper.decodeToken(token);

      if (!user || !user?.id) {
        return next(new Error("Unauthorized"));
      }

      socket.data.user = user;

      return next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { id: userId, role } = socket.data.user;

    // Join user/role rooms for targeted/broadcast events
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);

    socket.emit("socket:connected", { ok: true });

    socket.on("disconnect", (reason) => {
      // Optional cleanup/log
      console.log(`Socket ${socket.id} disconnected:`, reason);
    });
  });

  // Note: your join uses `user:${id}`; to target a technician by user id, emit to that room
  const notifyJobAssigned = (technicianUserId, payload) => {
    io.to(`user:${technicianUserId}`).emit("job:assigned", payload);
  };

  return { io, notifyJobAssigned };
};

export default createSocketServer;
