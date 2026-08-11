import { Request, Response } from "express";
import {
  createSociety,
  createSocietyAdmin,
} from "../services/society.service.js";


export const createSocietyController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      address,
      phone,
      email,
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: "Name and address are required",
      });
    }

    const society = await createSociety({
      name,
      address,
      phone,
      email,
    });

    return res.status(201).json({
      success: true,
      message: "Society created successfully",
      data: society,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create society",
    });
  }
};

export const createSocietyAdminController = async (
  req: Request,
  res: Response
) => {
  try {
    const { societyId } = req.params as { societyId: string };

    const {
      name,
      email,
      password,
    } = req.body;

    if (!societyId) {
      return res.status(400).json({
        success: false,
        message: "Society ID is required",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const admin = await createSocietyAdmin({
      societyId,
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Society admin created successfully",
      data: admin,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create society admin";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
