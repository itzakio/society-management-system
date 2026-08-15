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
  validate,
} from "../middlewares/validate.middleware.js";

import {
  createResidentController,
} from "../controllers/resident.controller.js";

import {
  createResidentSchema,
} from "../validations/resident.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(createResidentSchema),
  createResidentController
);

export default router;