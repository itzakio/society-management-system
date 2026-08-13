import { z } from "zod";
import { paginationQuerySchema } from "./common.validation.js";

export const createBuildingSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Building name must be at least 2 characters"),

    address: z
      .string()
      .trim()
      .optional(),

    numberOfFloors: z
      .number()
      .int()
      .min(1, "Building must have at least 1 floor"),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateBuildingSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .optional(),

    address: z
      .string()
      .trim()
      .optional(),

    numberOfFloors: z
      .number()
      .int()
      .min(1)
      .optional(),

    status: z
      .enum(["active", "inactive"])
      .optional(),
  }),

  params: z.object({
    buildingId: z.string().min(1),
  }),

  query: z.object({}),
});

export const buildingIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    buildingId: z.string().min(1),
  }),

  query: z.object({}),
});

export const getBuildingsSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: paginationQuerySchema,
});