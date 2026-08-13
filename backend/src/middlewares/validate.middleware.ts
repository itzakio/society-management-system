import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    const validatedData = result.data as {
      body: any;
      params: any;
      query: any;
    };

    Object.defineProperty(req, "body", {
      value: validatedData.body,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    Object.defineProperty(req, "params", {
      value: validatedData.params,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    Object.defineProperty(req, "query", {
      value: validatedData.query,
      writable: true,
      configurable: true,
      enumerable: true,
    });

    next();
  };
};