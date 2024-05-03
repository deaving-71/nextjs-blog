import logger from "#services/logger";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = async (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.badRequest({
      message: "Validation error",
      errors: err.flatten(),
    });
  }

  logger.error(`unhandled error\n ${JSON.stringify(err)}`);
  res.internalServerError({
    message: "Something went wrong, please try again later",
  });
};
