import { Response } from "express";

import { AuthRequest } from "../types/auth.types.js";

import {
  createResident,
  getResidents,
  getResidentById,
  getResidentMemberships,
  updateResident,
  deactivateResident,
  updateResidentMembership,
} from "../services/resident.service.js";

import { getPagination } from "../utils/pagination.js";

const getResidentIdFromParams = (residentId: string | string[] | undefined) => {
  if (Array.isArray(residentId)) {
    return residentId[0];
  }

  return residentId;
};

export const createResidentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const resident = await createResident(req.tenantId, req.body);

    return res.status(201).json({
      success: true,
      message: "Resident created successfully",
      data: resident,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create resident";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getResidentsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const pagination = getPagination(req);

    const result = await getResidents(req.tenantId, pagination);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch residents",
    });
  }
};

export const getResidentByIdController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const residentId = getResidentIdFromParams(req.params.residentId);

    if (!residentId) {
      return res.status(400).json({
        success: false,
        message: "Resident id is required",
      });
    }

    const resident = await getResidentById(residentId, req.tenantId);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    const memberships = await getResidentMemberships(residentId, req.tenantId);

    return res.status(200).json({
      success: true,
      data: {
        resident,
        memberships,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resident",
    });
  }
};

export const updateResidentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const residentId = getResidentIdFromParams(req.params.residentId);

    if (!residentId) {
      return res.status(400).json({
        success: false,
        message: "Resident id is required",
      });
    }

    const result = await updateResident(residentId, req.tenantId, req.body);

    return res.status(200).json({
      success: true,
      message: "Resident updated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update resident";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const updateResidentMembershipController =
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

      const { residentId } =
        req.params;

      const membership =
        await updateResidentMembership(
          residentId,
          req.tenantId,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Resident membership updated successfully",
        data: membership,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update membership";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  };

export const deactivateResidentController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const residentId = getResidentIdFromParams(req.params.residentId);

    if (!residentId) {
      return res.status(400).json({
        success: false,
        message: "Resident id is required",
      });
    }

    const result = await deactivateResident(residentId, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Resident deactivated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to deactivate resident";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};