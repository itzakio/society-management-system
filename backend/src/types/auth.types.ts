import { Request } from "express";

export interface AuthUser {
  userId: string;
  role: string;
  societyId: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  tenantId?: string;
}