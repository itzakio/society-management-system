import { Request, Response } from "express";
import { loginUser } from "../services/auth.service.js";
import { acceptInvitation } from "../services/invitation.service.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export const acceptInvitationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await acceptInvitation(req.body);

    return res.status(200).json({
      success: true,
      message: "Account activated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to activate account";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
