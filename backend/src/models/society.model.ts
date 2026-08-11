import mongoose, { Document, Schema } from "mongoose";

export interface ISociety extends Document {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: "active" | "inactive";
}

const societySchema = new Schema<ISociety>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Society = mongoose.model<ISociety>("Society", societySchema);

export default Society;
