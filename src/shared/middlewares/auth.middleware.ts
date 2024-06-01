import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";
import { AWS } from "../helper";
import { container } from "tsyringe";

const awsHelper = container.resolve(AWS);

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new BadRequestError("failed to find token");
  }

  const verifySecret = awsHelper.verifySecret(token);

  if (!verifySecret) {
    throw new BadRequestError("token failed verification");
  }

  req.body.user = verifySecret;

  next();
};
