import { Router } from "express";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

import {
  createSocietyController,
} from "../controllers/society.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin"),
  createSocietyController
);

export default router;