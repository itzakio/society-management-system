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
  createBuildingController,
  getBuildingsController,
  getBuildingByIdController,
  updateBuildingController,
  deleteBuildingController,
} from "../controllers/building.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  createBuildingController
);

router.get(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  getBuildingsController
);

router.get(
  "/:buildingId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  getBuildingByIdController
);

router.patch(
  "/:buildingId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  updateBuildingController
);

router.delete(
  "/:buildingId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  deleteBuildingController
);

export default router;