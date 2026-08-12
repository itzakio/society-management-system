import mongoose, { Document, Schema } from "mongoose";

export interface IBuilding extends Document {
  name: string;
  societyId: mongoose.Types.ObjectId;
  address?: string;
  numberOfFloors: number;
  status: "active" | "inactive";
}

const buildingSchema = new Schema<IBuilding>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    societyId: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    address: {
      type: String,
      trim: true,
    },

    numberOfFloors: {
      type: Number,
      required: true,
      min: 1,
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

const Building = mongoose.model<IBuilding>(
  "Building",
  buildingSchema
);

export default Building;