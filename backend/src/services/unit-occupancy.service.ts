import ResidentMembership from "../models/residentMembership.model.js";

export const isUnitOccupied = async (
  unitId: string,
  societyId: string
) => {
  const activeResident =
    await ResidentMembership.exists({
      unitId,
      societyId,
      status: "active",
      isResident: true,
    });

  return Boolean(activeResident);
};

export const getUnitOccupancy = async (
  unitId: string,
  societyId: string
) => {
  const memberships =
    await ResidentMembership.find({
      unitId,
      societyId,
      status: "active",
    }).populate({
      path: "residentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

  const residents = memberships.filter(
    (membership) =>
      membership.isResident
  );

  return {
    isOccupied: residents.length > 0,
    residentCount: residents.length,
    memberships,
  };
};