import { Request, Response, NextFunction, Router } from "express";
import { container } from "tsyringe";
import { SubscriptionController } from "../controllers";
import { authMiddleware } from "../../../shared/middlewares";

const subscriptionRouter = Router();
const subscriptionController = container.resolve(SubscriptionController);

subscriptionRouter.post("/subscribe", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  subscriptionController.createSubscription(req, res, next),
);

export default subscriptionRouter;
