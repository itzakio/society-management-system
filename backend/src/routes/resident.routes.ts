import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { requireTenant } from "../middlewares/tenant.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createResidentController,
  deactivateResidentController,
  updateResidentController,
  updateResidentMembershipController,
} from "../controllers/resident.controller.js";

import {
  createResidentSchema,
  updateResidentMembershipSchema,
  updateResidentSchema,
} from "../validations/resident.validation.js";
import {
  getResidentsController,
  getResidentByIdController,
} from "../controllers/resident.controller.js";

import { paginationQuerySchema } from "../validations/common.validation.js";

import { z } from "zod";
const residentIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    residentId: z.string().min(1),
  }),

  query: z.object({}),
});

const router = Router();

router.post(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(createResidentSchema),
  createResidentController,
);
router.get(
  "/",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(
    z.object({
      body: z.object({}),
      params: z.object({}),
      query: paginationQuerySchema,
    }),
  ),
  getResidentsController,
);

router.get(
  "/:residentId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(residentIdSchema),
  getResidentByIdController,
);
export default router;

router.patch(
  "/:residentId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(updateResidentSchema),
  updateResidentController,
);

router.patch(
  "/:residentId/membership",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(
    updateResidentMembershipSchema
  ),
  updateResidentMembershipController
);

router.delete(
  "/:residentId",
  authenticate,
  requireTenant,
  authorizeRoles("society_admin"),
  validate(residentIdSchema),
  deactivateResidentController,
);
