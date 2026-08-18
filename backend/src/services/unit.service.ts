import mongoose from "mongoose";
import Unit, { UnitStatus } from "../models/unit.model.js";
import Building from "../models/building.model.js";
import {
  PaginationOptions,
  getPaginationMeta,
} from "../utils/pagination.js";



interface CreateUnitInput {
  unitNumber: string;
  societyId: string;
  buildingId: string;
  floor: number;
  type?: "apartment" | "shop" | "office" | "parking";
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface UpdateUnitInput {
  unitNumber?: string;
  floor?: number;
  type?: "apartment" | "shop" | "office" | "parking";
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: UnitStatus;
}

export const createUnit = async (
  data: CreateUnitInput
) => {
  // Make sure the building belongs
  // to the current society.
  const building = await Building.findOne({
    _id: data.buildingId,
    societyId: data.societyId,
    status: "active",
  });

  if (!building) {
    throw new Error(
      "Building not found in this society"
    );
  }

  // Prevent duplicate unit numbers
  // inside the same building.
  const existingUnit = await Unit.findOne({
    unitNumber: data.unitNumber,
    buildingId: data.buildingId,
    societyId: data.societyId,
    status: { $ne: "inactive" },
  });

  if (existingUnit) {
    throw new Error(
      "Unit number already exists in this building"
    );
  }

  const unit = await Unit.create({
    unitNumber: data.unitNumber,
    societyId: new mongoose.Types.ObjectId(
      data.societyId
    ),
    buildingId: new mongoose.Types.ObjectId(
      data.buildingId
    ),
    floor: data.floor,
    type: data.type,
    area: data.area,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
  });

  return unit;
};

export const getUnits = async (
  societyId: string,
  buildingId: string | undefined,
  pagination: PaginationOptions
) => {
  const filter: {
    societyId: string;
    status: { $ne: UnitStatus };
    buildingId?: string;
  } = {
    societyId,
    status: { $ne: "inactive" },
  };

  if (buildingId) {
    filter.buildingId = buildingId;
  }

  const [units, total] = await Promise.all([
    Unit.find(filter)
      .populate("buildingId", "name")
      .sort({
        floor: 1,
        unitNumber: 1,
      })
      .skip(pagination.skip)
      .limit(pagination.limit),

    Unit.countDocuments(filter),
  ]);

  return {
    units,
    pagination: getPaginationMeta(
      total,
      pagination.page,
      pagination.limit
    ),
  };
};

export const getUnitById = async (
  unitId: string | string[],
  societyId: string
) => {
  return Unit.findOne({
    _id: unitId,
    societyId,
    status: { $ne: "inactive" },
  }).populate("buildingId", "name");
};

export const updateUnit = async (
  unitId: string | string[],
  societyId: string,
  data: UpdateUnitInput
) => {
  if (data.unitNumber) {
    const existingUnit = await Unit.findOne({
      _id: { $ne: unitId },
      unitNumber: data.unitNumber,
      societyId,
      status: { $ne: "inactive" },
    });

    if (existingUnit) {
      throw new Error(
        "Unit number already exists"
      );
    }
  }

  return Unit.findOneAndUpdate(
    {
      _id: unitId,
      societyId,
      status: { $ne: "inactive" },
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("buildingId", "name");
};

export const deleteUnit = async (
  unitId: string | string[],
  societyId: string
) => {
  return Unit.findOneAndUpdate(
    {
      _id: unitId,
      societyId,
      status: { $ne: "inactive" },
    },
    {
      $set: {
        status: "inactive",
      },
    },
    {
      new: true,
    }
  );
};