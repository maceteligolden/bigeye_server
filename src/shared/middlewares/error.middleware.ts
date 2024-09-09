import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { LoggerService } from "../services";
import { CustomError } from "../errors";
import { StatusCodes } from "../constants";
import { Res } from "../helper";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const logger = container.resolve(LoggerService);
  logger.log(`${err.message}`);
  if (err instanceof CustomError) {
    return Res({
      res,
      code: err.statusCode,
      message: "error occured",
      error: err.serializeErrors(),
    });
  }

  Res({
    res,
    code: StatusCodes.INTERNAL_SERVER,
    message: "error occured",
    error: [{ message: err.message }],
  });
};
