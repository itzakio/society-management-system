import { Request } from "express";

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPagination = (req: Request): PaginationOptions => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
