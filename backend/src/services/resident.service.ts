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
import { PaginationOptions, getPaginationMeta } from "../utils/pagination.js";

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

interface UpdateResidentInput {
  name?: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

interface UpdateResidentMembershipInput {
  unitId?: string;

  relationship?:
    | "owner"
    | "tenant"
    | "family_member";

  isResident?: boolean;

  ownershipPercentage?: number;

  startDate?: Date;
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

export const getResidents = async (
  societyId: string,
  pagination: PaginationOptions,
) => {
  const { page, limit, skip } = pagination;

  const filter = {
    societyId,
  };

  const [residents, total] = await Promise.all([
    Resident.find(filter)
      .populate("userId", "name email role isActive")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Resident.countDocuments(filter),
  ]);

  return {
    residents,
    pagination: getPaginationMeta(total, page, limit),
  };
};

export const getResidentById = async (
  residentId: string | string[] | undefined,
  societyId: string,
) => {
  const resident = await Resident.findOne({
    _id: residentId,
    societyId,
  }).populate("userId", "name email role isActive");

  return resident;
};

export const getResidentMemberships = async (
  residentId: string | string[] | undefined,
  societyId: string,
) => {
  return ResidentMembership.find({
    residentId,
    societyId,
  })
    .populate("unitId", "unitNumber floorNumber type status")
    .sort({
      createdAt: -1,
    });
};

export const updateResident = async (
  residentId: string,
  societyId: string,
  data: UpdateResidentInput
) => {
  const resident = await Resident.findOne({
    _id: residentId,
    societyId,
  });

  if (!resident) {
    throw new Error("Resident not found");
  }

  const user = await User.findOne({
    _id: resident.userId,
    societyId,
  });

  if (!user) {
    throw new Error("User account not found");
  }

  if (data.name !== undefined) {
    user.name = data.name;
  }

  if (data.phone !== undefined) {
    resident.phone = data.phone;
  }

  if (
    data.emergencyContactName !== undefined
  ) {
    resident.emergencyContactName =
      data.emergencyContactName;
  }

  if (
    data.emergencyContactPhone !== undefined
  ) {
    resident.emergencyContactPhone =
      data.emergencyContactPhone;
  }

  await user.save();
  await resident.save();

  return {
    resident,
    user,
  };
};

export const updateResidentMembership =
  async (
    residentId: string | string[] | undefined,
    societyId: string,
    data: UpdateResidentMembershipInput
  ) => {
    const resident =
      await Resident.findOne({
        _id: residentId,
        societyId,
      });

    if (!resident) {
      throw new Error(
        "Resident not found"
      );
    }

    const membership =
      await ResidentMembership.findOne({
        residentId,
        societyId,
        status: "active",
      });

    if (!membership) {
      throw new Error(
        "Active membership not found"
      );
    }

    /*
     * Check if unit is changing
     */
    const unitChanged =
      data.unitId !== undefined &&
      data.unitId !==
        membership.unitId.toString();

    if (unitChanged) {
      const newUnit = await Unit.findOne({
        _id: data.unitId,
        societyId,
        status: {
          $ne: "inactive",
        },
      });

      if (!newUnit) {
        throw new Error(
          "New unit not found in this society"
        );
      }

      /*
       * Close old membership
       */
      membership.status =
        "inactive";

      membership.endDate =
        new Date();

      await membership.save();

      /*
       * Create new membership
       */
      const newMembership =
        await ResidentMembership.create({
          residentId:
            resident._id,

          societyId:
            resident.societyId,

          unitId: newUnit._id,

          relationship:
            data.relationship ??
            membership.relationship,

          isResident:
            data.isResident ??
            membership.isResident,

          ownershipPercentage:
            data.ownershipPercentage ??
            membership.ownershipPercentage,

          startDate:
            data.startDate ??
            new Date(),

          status: "active",
        });

      return newMembership;
    }

    /*
     * Same unit → update existing membership
     */
    if (
      data.relationship !== undefined
    ) {
      membership.relationship =
        data.relationship;
    }

    if (
      data.isResident !== undefined
    ) {
      membership.isResident =
        data.isResident;
    }

    if (
      data.ownershipPercentage !==
      undefined
    ) {
      membership.ownershipPercentage =
        data.ownershipPercentage;
    }

    if (
      data.startDate !== undefined
    ) {
      membership.startDate =
        data.startDate;
    }

    await membership.save();

    return membership;
  };

export const deactivateResident =
  async (
    residentId: string,
    societyId: string
  ) => {
    const resident =
      await Resident.findOne({
        _id: residentId,
        societyId,
      });

    if (!resident) {
      throw new Error(
        "Resident not found"
      );
    }

    if (
      resident.status === "inactive"
    ) {
      throw new Error(
        "Resident is already inactive"
      );
    }

    const user = await User.findOne({
      _id: resident.userId,
      societyId,
    });

    if (!user) {
      throw new Error(
        "User account not found"
      );
    }

    /*
     * Deactivate resident
     */
    resident.status = "inactive";

    await resident.save();

    /*
     * Disable login
     */
    user.isActive = false;

    await user.save();

    /*
     * Close active memberships
     */
    await ResidentMembership.updateMany(
      {
        residentId: resident._id,
        societyId,
        status: "active",
      },
      {
        $set: {
          status: "inactive",
          endDate: new Date(),
        },
      }
    );

    return {
      residentId: resident._id,
      status: resident.status,
    };
  };