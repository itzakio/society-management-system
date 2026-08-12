import { Router } from "express";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  requireTenant,
} from "../middlewares/tenant.middleware.js";

import {
  login,
} from "../controllers/auth.controller.js";

import { AuthRequest } from "../types/auth.types.js";

const router = Router();

router.post("/login", login);

router.get(
  "/me",
  authenticate,
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.get(
  "/tenant-test",
  authenticate,
  requireTenant,
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "Tenant middleware is working",
      tenantId: req.tenantId,
      user: req.user,
    });
  }
);

export default router;