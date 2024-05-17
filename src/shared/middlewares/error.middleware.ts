import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { LoggerService } from "../services";
import { CustomError } from "../errors";
import { StatusCodes } from "../constants";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logger = container.resolve(LoggerService);
    logger.log(`${err.message}`);
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER).send({
        errors: [{ message: err.message }]
    });
};