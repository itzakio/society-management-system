import mongoose, { Document, Schema } from "mongoose";

export type UnitStatus =
  | "available"
  | "occupied"
  | "inactive";

export type UnitType =
  | "apartment"
  | "shop"
  | "office"
  | "parking";

export interface IUnit extends Document {
  unitNumber: string;
  societyId: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId;
  floor: number;
  type: UnitType;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  status: UnitStatus;
}

const unitSchema = new Schema<IUnit>(
  {
    unitNumber: {
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

    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true,
      index: true,
    },

    floor: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: [
        "apartment",
        "shop",
        "office",
        "parking",
      ],
      default: "apartment",
    },

    area: {
      type: Number,
      min: 0,
    },

    bedrooms: {
      type: Number,
      min: 0,
    },

    bathrooms: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "available",
        "occupied",
        "inactive",
      ],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model<IUnit>(
  "Unit",
  unitSchema
);

export default Unit;