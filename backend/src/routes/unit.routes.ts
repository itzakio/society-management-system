import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { requireTenant } from "../middlewares/tenant.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  createUnitController,
  getUnitsController,
  getUnitByIdController,
  updateUnitController,
  deleteUnitController,
} from "../controllers/unit.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getUnitsSchema } from "../validations/unit.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  createUnitController,
);

router.get(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(getUnitsSchema),
  getUnitsController,
);
router.get(
  "/:unitId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  getUnitByIdController,
);

router.patch(
  "/:unitId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  updateUnitController,
);

router.delete(
  "/:unitId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  deleteUnitController,
);

export default router;
