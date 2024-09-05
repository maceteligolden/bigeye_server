import { Request, Response, NextFunction, Router } from "express";
import NotificationController from "./notification.controller";
import { container } from "tsyringe";

const notificationRouter = Router();
const notificationController = container.resolve(NotificationController);

notificationRouter.post("/test", (req: Request, res: Response, next: NextFunction)=> notificationController.testNotification(req, res, next));

export default notificationRouter;