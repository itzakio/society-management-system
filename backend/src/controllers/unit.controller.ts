import { Response } from "express";
import { AuthRequest } from "../types/auth.types.js";

import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "../services/unit.service.js";

import { getPagination } from "../utils/pagination.js";

export const createUnitController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const {
      unitNumber,
      buildingId,
      floor,
      type,
      area,
      bedrooms,
      bathrooms,
    } = req.body;

    if (
      !unitNumber ||
      !buildingId ||
      floor === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "unitNumber, buildingId and floor are required",
      });
    }

    const unit = await createUnit({
      unitNumber,
      buildingId,
      floor,
      type,
      area,
      bedrooms,
      bathrooms,
      societyId: req.tenantId,
    });

    return res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: unit,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create unit";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const getUnitsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const pagination = getPagination(req);

    const buildingId =
      typeof req.query.buildingId === "string"
        ? req.query.buildingId
        : undefined;

    const result = await getUnits(
      req.tenantId,
      buildingId,
      pagination
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch units",
    });
  }
};

export const getUnitByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const { unitId } = req.params;

    if (!unitId) {
      return res.status(400).json({
        success: false,
        message: "Unit ID is required",
      });
    }

    const unit = await getUnitById(
      unitId,
      req.tenantId
    );

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unit",
    });
  }
};

export const updateUnitController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const { unitId } = req.params;

    if (!unitId) {
      return res.status(400).json({
        success: false,
        message: "Unit ID is required",
      });
    }

    const unit = await updateUnit(
      unitId,
      req.tenantId,
      req.body
    );

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: unit,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update unit";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

export const deleteUnitController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.tenantId) {
      return res.status(403).json({
        success: false,
        message: "Society context is required",
      });
    }

    const { unitId } = req.params;

    if (!unitId) {
      return res.status(400).json({
        success: false,
        message: "Unit ID is required",
      });
    }

    const unit = await deleteUnit(
      unitId,
      req.tenantId
    );

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete unit",
    });
  }
};