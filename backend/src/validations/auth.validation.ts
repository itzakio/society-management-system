import { z } from "zod";

export const acceptInvitationSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Invitation token is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
  }),

  params: z.object({}),

  query: z.object({}),
});
