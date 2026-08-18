import { Response } from "express";

import { AuthRequest } from "../types/auth.types.js";

import {
  getSocietyDashboard,
} from "../services/dashboard.service.js";

export const getSocietyDashboardController =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      if (!req.tenantId) {
        return res.status(403).json({
          success: false,
          message:
            "Society context is required",
        });
      }

      const dashboard =
        await getSocietyDashboard(
          req.tenantId
        );

      return res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard data",
      });
    }
  };