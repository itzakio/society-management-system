import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.js";

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async ({
  email,
  password,
}: LoginInput) => {
  // 1. Find user
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check account status
  if (!user.isActive) {
    throw new Error("Your account is inactive");
  }

  // 3. Compare password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // 4. Generate JWT
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    societyId: user.societyId
      ? user.societyId.toString()
      : null,
  });

  return {
    accessToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      societyId: user.societyId,
    },
  };
};