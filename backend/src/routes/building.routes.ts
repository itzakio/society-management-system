import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { requireTenant } from "../middlewares/tenant.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  createBuildingController,
  getBuildingsController,
  getBuildingByIdController,
  updateBuildingController,
  deleteBuildingController,
} from "../controllers/building.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  buildingIdSchema,
  createBuildingSchema,
  updateBuildingSchema,
  getBuildingsSchema,
} from "../validations/building.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(createBuildingSchema),
  createBuildingController,
);

router.get(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(getBuildingsSchema),
  getBuildingsController,
);

router.get(
  "/:buildingId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(buildingIdSchema),
  getBuildingByIdController,
);

router.patch(
  "/:buildingId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(updateBuildingSchema),
  updateBuildingController,
);

router.delete(
  "/:buildingId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(buildingIdSchema),
  deleteBuildingController,
);

export default router;
