import { Response } from "express";

import { AuthRequest } from "../types/auth.types.js";

import {
  createResident,
} from "../services/resident.service.js";

export const createResidentController =
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

      const resident =
        await createResident(
          req.tenantId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          "Resident created successfully",
        data: resident,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create resident";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  };