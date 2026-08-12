import { Response } from "express";
import { AuthRequest } from "../types/auth.types.js";

import {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from "../services/building.service.js";
import { getPagination } from "../utils/pagination.js";

export const createBuildingController = async (
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
      name,
      address,
      numberOfFloors,
    } = req.body;

    if (!name || numberOfFloors === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and numberOfFloors are required",
      });
    }

    const building = await createBuilding({
      name,
      address,
      numberOfFloors,
      societyId: req.tenantId,
    });

    return res.status(201).json({
      success: true,
      message: "Building created successfully",
      data: building,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create building",
    });
  }
};

export const getBuildingsController = async (
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

    const result = await getBuildings(
      req.tenantId,
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
      message: "Failed to fetch buildings",
    });
  }
};

export const getBuildingByIdController = async (
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

    const { buildingId } = req.params;

    if (!buildingId) {
      return res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
    }

    const building = await getBuildingById(
      buildingId,
      req.tenantId
    );

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: building,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch building",
    });
  }
};


export const updateBuildingController = async (
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

    const { buildingId } = req.params;

    if (!buildingId) {
      return res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
    }

    const {
      name,
      address,
      numberOfFloors,
      status,
    } = req.body;

    const building = await updateBuilding(
      buildingId,
      req.tenantId,
      {
        name,
        address,
        numberOfFloors,
        status,
      }
    );

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Building updated successfully",
      data: building,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update building",
    });
  }
};

export const deleteBuildingController = async (
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

    const { buildingId } = req.params;

    if (!buildingId) {
      return res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
    }

    const building = await deleteBuilding(
      buildingId,
      req.tenantId
    );

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Building deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete building",
    });
  }
};