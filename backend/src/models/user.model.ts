import mongoose, { Document, Schema } from "mongoose";

export type UserRole =
  | "super_admin"
  | "society_admin"
  | "manager"
  | "accountant"
  | "security"
  | "resident";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  societyId: mongoose.Types.ObjectId | null;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["super_admin","society_admin", "manager", "accountant", "security", "resident"],
      default: "resident",
    },

    societyId: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
