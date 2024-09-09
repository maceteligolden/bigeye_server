import { Request, Response, NextFunction, Router } from "express";
import NotificationController from "./notification.controller";
import { container } from "tsyringe";
import { authMiddleware } from "../../shared/middlewares";

const notificationRouter = Router();
const notificationController = container.resolve(NotificationController);

notificationRouter.post("/test", (req: Request, res: Response, next: NextFunction) =>
  notificationController.testNotification(req, res, next),
);

notificationRouter.patch("/", authMiddleware, (req: Request, res: Response, next: NextFunction) =>
  notificationController.updateNotification(req, res, next),
);

export default notificationRouter;
