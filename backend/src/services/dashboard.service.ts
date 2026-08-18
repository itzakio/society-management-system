import Building from "../models/building.model.js";
import Unit from "../models/unit.model.js";
import Resident from "../models/resident.model.js";
import ResidentMembership from "../models/residentMembership.model.js";

export const getSocietyDashboard = async (
  societyId: string
) => {
  const [
    totalBuildings,
    activeBuildings,

    totalUnits,
    activeUnits,
    inactiveUnits,

    occupiedUnits,

    totalResidents,
    invitedResidents,
    inactiveResidents,

    ownerCount,
    tenantCount,
    familyMemberCount,
  ] = await Promise.all([
    // Buildings
    Building.countDocuments({
      societyId,
    }),

    Building.countDocuments({
      societyId,
      status: "active",
    }),

    // Units
    Unit.countDocuments({
      societyId,
    }),

    Unit.countDocuments({
      societyId,
      status: { $ne: "inactive" },
    }),

    Unit.countDocuments({
      societyId,
      status: "inactive",
    }),

    // Occupied units
    ResidentMembership.distinct(
      "unitId",
      {
        societyId,
        status: "active",
        isResident: true,
      }
    ),

    // Residents
    Resident.countDocuments({
      societyId,
      status: "active",
    }),

    Resident.countDocuments({
      societyId,
      status: "invited",
    }),

    Resident.countDocuments({
      societyId,
      status: "inactive",
    }),

    // Membership types
    ResidentMembership.countDocuments({
      societyId,
      status: "active",
      relationship: "owner",
    }),

    ResidentMembership.countDocuments({
      societyId,
      status: "active",
      relationship: "tenant",
    }),

    ResidentMembership.countDocuments({
      societyId,
      status: "active",
      relationship: "family_member",
    }),
  ]);

  const occupiedCount =
    occupiedUnits.length;

  const availableCount =
    Math.max(
      activeUnits - occupiedCount,
      0
    );

  const occupancyRate =
    activeUnits > 0
      ? Number(
          (
            (occupiedCount /
              activeUnits) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    buildings: {
      total: totalBuildings,
      active: activeBuildings,
    },

    units: {
      total: totalUnits,
      active: activeUnits,
      inactive: inactiveUnits,
      occupied: occupiedCount,
      available: availableCount,
      occupancyRate,
    },

    residents: {
      active: totalResidents,
      invited: invitedResidents,
      inactive: inactiveResidents,
      owners: ownerCount,
      tenants: tenantCount,
      familyMembers: familyMemberCount,
    },
  };
};