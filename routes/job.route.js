import { Router } from "express";
import controllers from "../controllers/index.js";
import { ROLE } from "../utils/enums.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get(
  "/",
  auth(["*"]),
  controllers.job.getAllJobs.validator,
  controllers.job.getAllJobs.handler
);

router.get(
  "/:id",
  auth(["*"]),
  controllers.job.getJobById.validator,
  controllers.job.getJobById.handler
);

router.post(
  "/add",
  auth([ROLE.ADMIN, ROLE.MANAGER]),
  controllers.job.createJob.validator,
  controllers.job.createJob.handler
);

router.put(
  "/update/:id",
  auth([ROLE.ADMIN, ROLE.MANAGER, ROLE.TECHNICIAN]),
  controllers.job.updateJob.validator,
  controllers.job.updateJob.handler
);

router.delete(
  "/:id",
  auth(["*"]),
  controllers.job.deleteJob.validator,
  controllers.job.deleteJob.handler
);

export default router;
