import { z } from "zod";
import { paginationQuerySchema } from "./common.validation.js";

const unitTypes = [
  "apartment",
  "shop",
  "office",
  "parking",
] as const;

const unitStatuses = [
  "available",
  "occupied",
  "inactive",
] as const;

export const createUnitSchema = z.object({
  body: z.object({
    unitNumber: z
      .string()
      .trim()
      .min(1, "Unit number is required"),

    buildingId: z
      .string()
      .min(1, "Building ID is required"),

    floor: z
      .number()
      .int()
      .min(0, "Floor cannot be negative"),

    type: z
      .enum(unitTypes)
      .optional(),

    area: z
      .number()
      .positive()
      .optional(),

    bedrooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    bathrooms: z
      .number()
      .int()
      .min(0)
      .optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateUnitSchema = z.object({
  body: z.object({
    unitNumber: z
      .string()
      .trim()
      .min(1)
      .optional(),

    floor: z
      .number()
      .int()
      .min(0)
      .optional(),

    type: z
      .enum(unitTypes)
      .optional(),

    area: z
      .number()
      .positive()
      .optional(),

    bedrooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    bathrooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    status: z
      .enum(unitStatuses)
      .optional(),
  }),

  params: z.object({
    unitId: z.string().min(1),
  }),

  query: z.object({}),
});

export const getUnitsSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: paginationQuerySchema.extend({
    buildingId: z
      .string()
      .min(1)
      .optional(),
  }),
});