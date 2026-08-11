import bcrypt from "bcrypt";
import Society from "../models/society.model.js";
import User from "../models/user.model.js";

interface CreateSocietyInput {
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

interface CreateSocietyAdminInput {
  societyId: string ;
  name: string;
  email: string;
  password: string;
}

export const createSociety = async (
  data: CreateSocietyInput
) => {
  const society = await Society.create({
    name: data.name,
    address: data.address,
    phone: data.phone,
    email: data.email,
  });

  return society;
};

export const createSocietyAdmin = async (
  data: CreateSocietyAdminInput
) => {
  // Check whether society exists
  const society = await Society.findById(data.societyId);

  if (!society) {
    throw new Error("Society not found");
  }

  // Check whether email is already used
  const existingUser = await User.findOne({
    email: data.email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    data.password,
    12
  );

  // Create admin
  const admin = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: "society_admin",
    societyId: society._id,
    isActive: true,
  });

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    societyId: admin.societyId,
  };
};