import { Router } from "express";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

import {
  createSocietyController,
  createSocietyAdminController,
} from "../controllers/society.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin"),
  createSocietyController
);

router.post(
  "/:societyId/admin",
  authenticate,
  authorizeRoles("super_admin"),
  createSocietyAdminController
);

export default router;