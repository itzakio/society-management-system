import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Resident from "../models/resident.model.js";
import Invitation from "../models/invitation.model.js";

import { hashInvitationToken } from "../utils/invitation.js";

interface AcceptInvitationInput {
  token: string;
  password: string;
}

export const acceptInvitation = async (data: AcceptInvitationInput) => {
  const tokenHash = hashInvitationToken(data.token);

  const invitation = await Invitation.findOne({
    tokenHash,
  });

  if (!invitation) {
    throw new Error("Invalid invitation");
  }

  if (invitation.usedAt) {
    throw new Error("This invitation has already been used");
  }

  if (invitation.expiresAt.getTime() < Date.now()) {
    throw new Error("This invitation has expired");
  }

  const user = await User.findById(invitation.userId);

  if (!user) {
    throw new Error("User account not found");
  }

  if (user.password) {
    throw new Error("This account has already been activated");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  user.password = hashedPassword;
  user.isActive = true;

  await user.save();

  await Resident.findOneAndUpdate(
    {
      userId: user._id,
      societyId: invitation.societyId,
    },
    {
      $set: {
        status: "active",
      },
    },
  );

  invitation.usedAt = new Date();

  await invitation.save();

  return {
    userId: user._id,
    email: user.email,
  };
};
