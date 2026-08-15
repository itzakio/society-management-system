import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { requireTenant } from "../middlewares/tenant.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { createResidentController } from "../controllers/resident.controller.js";

import { createResidentSchema } from "../validations/resident.validation.js";
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
