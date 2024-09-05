import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { Res } from "../../shared/helper";
import { StatusCodes } from "../../shared/constants";
import NotificationService from "./notification.service";

@injectable()
export default class NotificationController {
    constructor(
        private notificationService: NotificationService
    ){

    }

    async testNotification(req: Request, res: Response, next: NextFunction){
        try {

            const { sub } = req.user;

            const { message, device_token, subject } = req.body;

            const data = await this.notificationService.testNotification({
                message,
                device_token,
                subject,
                user_id: sub
            })

            Res({
                res, 
                code: StatusCodes.OK,
                message: "successfully tested notification",
                data
            })

        }catch(err: any){
            next(err)
        }
    }
}