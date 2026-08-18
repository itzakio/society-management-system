import { Router } from "express";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  requireTenant,
} from "../middlewares/tenant.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

import {
  getSocietyDashboardController,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/overview",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  getSocietyDashboardController
);

export default router;