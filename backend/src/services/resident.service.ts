import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Resident from "../models/resident.model.js";
import ResidentMembership from "../models/residentMembership.model.js";
import Unit from "../models/unit.model.js";
import {
  generateInvitationToken,
  hashInvitationToken,
} from "../utils/invitation.js";
import Invitation from "../models/invitation.model.js";
import { sendResidentInvitationEmail } from "./email.service.js";

interface CreateResidentInput {
  name: string;
  email: string;
  phone?: string;

  unitId: string;

  relationship: "owner" | "tenant" | "family_member";

  isResident: boolean;

  ownershipPercentage?: number;

  startDate: Date;

  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
export const createResident = async (
  societyId: string,
  data: CreateResidentInput,
) => {
  // 1. Verify unit belongs to this society
  const unit = await Unit.findOne({
    _id: data.unitId,
    societyId,
    status: {
      $ne: "inactive",
    },
  });

  if (!unit) {
    throw new Error("Unit not found in this society");
  }

  // 2. Check whether user already exists
  let user = await User.findOne({
    email: data.email.toLowerCase(),
  });

  if (user) {
    throw new Error("A user with this email already exists");
  }

  // Temporary password.
  // We'll replace this with an invitation
  // system shortly.
  const temporaryPassword = await bcrypt.hash("Temp@123456", 12);

  // 3. Create User
  user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: temporaryPassword,
    role: "resident",
    societyId: new mongoose.Types.ObjectId(societyId),
    isActive: true,
  });

  try {
    // 4. Create Resident profile
    const resident = await Resident.create({
      userId: user._id,
      societyId: new mongoose.Types.ObjectId(societyId),
      phone: data.phone,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      status: "invited",
    });

    // 5. Create membership
    const membership = await ResidentMembership.create({
      residentId: resident._id,

      societyId: new mongoose.Types.ObjectId(societyId),

      unitId: new mongoose.Types.ObjectId(data.unitId),

      relationship: data.relationship,

      isResident: data.isResident,

      ownershipPercentage: data.ownershipPercentage,

      startDate: data.startDate,

      status: "active",
    });

    const invitationToken = generateInvitationToken();

    const tokenHash = hashInvitationToken(invitationToken);

    await Invitation.create({
      userId: user._id,
      societyId: new mongoose.Types.ObjectId(societyId),
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    await sendResidentInvitationEmail({
      email: user.email,
      name: user.name,
      invitationToken,
    });
    return {
      resident: {
        id: resident._id,
        name: user.name,
        email: user.email,
        phone: resident.phone,
        status: resident.status,
      },

      membership: {
        id: membership._id,
        unitId: membership.unitId,
        relationship: membership.relationship,
        isResident: membership.isResident,
        ownershipPercentage: membership.ownershipPercentage,
        startDate: membership.startDate,
      },
    };
  } catch (error) {
    // If Resident/Membership creation fails,
    // remove the User we just created.
    await User.findByIdAndDelete(user._id);

    throw error;
  }
};
