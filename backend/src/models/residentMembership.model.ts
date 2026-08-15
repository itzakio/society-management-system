import mongoose, { Document, Schema } from "mongoose";

export type MembershipType = "owner" | "tenant" | "family_member";

export type MembershipStatus = "active" | "inactive";

export type MembershipRelationship = "owner" | "tenant" | "family_member";

export interface IResidentMembership
  extends Document {
  residentId: mongoose.Types.ObjectId;
  societyId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;

  relationship: MembershipRelationship;

  isResident: boolean;

  ownershipPercentage?: number;

  startDate: Date;
  endDate?: Date;

  status: MembershipStatus;
}

const residentMembershipSchema =
  new Schema<IResidentMembership>(
    {
      residentId: {
        type: Schema.Types.ObjectId,
        ref: "Resident",
        required: true,
        index: true,
      },

      societyId: {
        type: Schema.Types.ObjectId,
        ref: "Society",
        required: true,
        index: true,
      },

      unitId: {
        type: Schema.Types.ObjectId,
        ref: "Unit",
        required: true,
        index: true,
      },

      relationship: {
        type: String,
        enum: [
          "owner",
          "tenant",
          "family_member",
        ],
        required: true,
      },

      isResident: {
        type: Boolean,
        default: true,
      },

      ownershipPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
      },

      status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
      },
    },
    {
      timestamps: true,
    }
  );
residentMembershipSchema.index({
  societyId: 1,
  unitId: 1,
  status: 1,
});

const ResidentMembership = mongoose.model<IResidentMembership>(
  "ResidentMembership",
  residentMembershipSchema,
);

export default ResidentMembership;
