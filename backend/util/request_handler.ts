import { Request, Response, NextFunction } from "express";

export function requestHandler(
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any> | any
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
