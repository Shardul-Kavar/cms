import { Router } from "express";
import controllers from "../controllers/index.js";
import { ROLE } from "../utils/enums.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  controllers.user.registerUser.validator,
  controllers.user.registerUser.handler
);

router.post(
  "/login",
  controllers.user.loginUser.validator,
  controllers.user.loginUser.handler
);

router.get(
  "/",
  auth([ROLE.ADMIN, ROLE.MANAGER]),
  controllers.user.getAllUsers.validator,
  controllers.user.getAllUsers.handler
);

router.get("/profile", auth(["*"]), controllers.user.getUserProfile.handler);

router.get(
  "/:id",
  auth([ROLE.ADMIN, ROLE.MANAGER]),
  controllers.user.getUserById.validator,
  controllers.user.getUserById.handler
);

export default router;
