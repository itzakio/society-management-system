import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types.js";

export const requireTenant = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.societyId) {
    return res.status(403).json({
      success: false,
      message: "This action requires a society context",
    });
  }

  req.tenantId = req.user.societyId;

  next();
};