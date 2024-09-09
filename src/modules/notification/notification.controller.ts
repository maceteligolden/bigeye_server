import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";
import NotificationService from "./notification.service";

@injectable()
export default class NotificationController {
  constructor(private notificationService: NotificationService) {}

  async testNotification(req: Request, res: Response, next: NextFunction) {
    try {

      const { message, device_token, subject } = req.body;

      const data = await this.notificationService.testNotification({
        message,
        device_token,
        subject,
        user_id: "1",
      });

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully tested notification",
        data,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async updateNotification(req: Request, res: Response, next: NextFunction) {
    try {

      const { sub } = req.user;

      const { notification } = req.body;

      const data = await this.notificationService.updateNotification(sub, notification)

      Res({
        res,
        code: StatusCodes.OK,
        message: "successfully update profile notification preference",
        data,
      });
    } catch (err: any) {
      next(err);
    }
  }
}
