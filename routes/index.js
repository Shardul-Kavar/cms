import { Router } from "express";

import customerRoutes from "./customer.route.js";
import jobRoutes from "./job.route.js";
import userRoutes from "./user.route.js";

const router = Router();

router.use("/customer", customerRoutes);
router.use("/job", jobRoutes);
router.use("/user", userRoutes);

router.get("/", (req, res) => {
  res.send("Welcome to the CMS.");
});

router.use((req, res) => {
  console.error("Trying to", req.method, req.url);
  res.status(400).send("404 not found!");
});

export default router;
