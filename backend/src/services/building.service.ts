import Building from "../models/building.model.js";
import { PaginationOptions, getPaginationMeta } from "../utils/pagination.js";

interface CreateBuildingInput {
  name: string;
  societyId: string;
  address?: string;
  numberOfFloors: number;
}

interface UpdateBuildingInput {
  name?: string;
  address?: string;
  numberOfFloors?: number;
  status?: "active" | "inactive";
}

export const createBuilding = async (data: CreateBuildingInput) => {
  const building = await Building.create({
    name: data.name,
    societyId: data.societyId,
    address: data.address,
    numberOfFloors: data.numberOfFloors,
  });

  return building;
};

export const getBuildings = async (
  societyId: string,
  pagination: PaginationOptions,
) => {
  const { page, limit, skip } = pagination;

  const [buildings, total] = await Promise.all([
    Building.find({
      societyId,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Building.countDocuments({
      societyId,
    }),
  ]);

  return {
    buildings,
    pagination: getPaginationMeta(total, page, limit),
  };
};

export const getBuildingById = async (
  buildingId: string | string[],
  societyId: string,
) => {
  const building = await Building.findOne({
    _id: buildingId,
    societyId,
    status: "active",
  });

  return building;
};

export const updateBuilding = async (
  buildingId: string | string[],
  societyId: string,
  data: UpdateBuildingInput,
) => {
  const building = await Building.findOneAndUpdate(
    {
      _id: buildingId,
      societyId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return building;
};

export const deleteBuilding = async (
  buildingId: string | string[],
  societyId: string,
) => {
  const building = await Building.findOneAndUpdate(
    {
      _id: buildingId,
      societyId,
    },
    {
      $set: {
        status: "inactive",
      },
    },
    {
      new: true,
    },
  );

  return building;
};
