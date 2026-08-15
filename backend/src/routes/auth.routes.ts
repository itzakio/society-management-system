import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import { requireTenant } from "../middlewares/tenant.middleware.js";

import {
  acceptInvitationController,
  login,
} from "../controllers/auth.controller.js";

import { AuthRequest } from "../types/auth.types.js";
import { validate } from "../middlewares/validate.middleware.js";
import { acceptInvitationSchema } from "../validations/auth.validation.js";
import User from "../models/user.model.js";

const router = Router();

router.post("/login", login);

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        societyId: user.societyId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

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
  },
);

router.post(
  "/accept-invitation",
  validate(acceptInvitationSchema),
  acceptInvitationController,
);

export default router;
