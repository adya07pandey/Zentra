import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      type: "VALIDATION_ERROR",
      errors: err.errors.map(e => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        type: "DB_ERROR",
        message: "Duplicate field value",
        field: err.meta?.target,
      });
    }
  }

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }
  
  // DEFAULT ERROR
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};