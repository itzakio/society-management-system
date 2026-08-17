import { z } from "zod";

const relationships = [
  "owner",
  "tenant",
  "family_member",
] as const;

export const createResidentSchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2),

      email: z
        .string()
        .trim()
        .email(),

      phone: z
        .string()
        .trim()
        .optional(),

      unitId: z
        .string()
        .min(1),

      relationship: z.enum(
        relationships
      ),

      isResident: z
        .boolean()
        .default(true),

      ownershipPercentage: z
        .number()
        .min(0)
        .max(100)
        .optional(),

      startDate: z.coerce.date(),

      emergencyContactName: z
        .string()
        .trim()
        .optional(),

      emergencyContactPhone: z
        .string()
        .trim()
        .optional(),
    }),

    params: z.object({}),

    query: z.object({}),
  });

export const updateResidentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .optional(),

    phone: z
      .string()
      .trim()
      .optional(),

    emergencyContactName: z
      .string()
      .trim()
      .optional(),

    emergencyContactPhone: z
      .string()
      .trim()
      .optional(),
  }),

  params: z.object({
    residentId: z.string().min(1),
  }),

  query: z.object({}),
});

export const updateResidentMembershipSchema =
  z.object({
    body: z.object({
      unitId: z
        .string()
        .min(1)
        .optional(),

      relationship: z
        .enum([
          "owner",
          "tenant",
          "family_member",
        ])
        .optional(),

      isResident: z
        .boolean()
        .optional(),

      ownershipPercentage: z
        .number()
        .min(0)
        .max(100)
        .optional(),

      startDate: z
        .coerce
        .date()
        .optional(),
    }),

    params: z.object({
      residentId: z.string().min(1),
    }),

    query: z.object({}),
  });