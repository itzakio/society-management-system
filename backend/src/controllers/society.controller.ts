import { Request, Response } from "express";
import { createSociety } from "../services/society.service.js";

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