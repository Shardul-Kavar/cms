import { Router } from "express";
import controllers from "../controllers/index.js";
import { ROLE } from "../utils/enums.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post(
  "/add",
  controllers.customer.addCustomer.validator,
  controllers.customer.addCustomer.handler
);

router.put(
  "/update/:id",
  controllers.customer.updateCustomer.validator,
  controllers.customer.updateCustomer.handler
);

router.get(
  "/",
  auth([ROLE.ADMIN, ROLE.MANAGER]),
  controllers.customer.getAllCustomers.validator,
  controllers.customer.getAllCustomers.handler
);

export default router;
