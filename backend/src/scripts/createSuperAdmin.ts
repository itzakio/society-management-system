import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import User from "../models/user.model.js";

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      role: "super_admin",
    });

    if (existingAdmin) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    const password = "Admin@123456";

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "Platform Admin",
      email: "admin@societymanager.com",
      password: hashedPassword,
      role: "super_admin",
      societyId: null,
    });

    console.log("Super Admin created");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create Super Admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();