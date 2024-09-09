import { injectable } from "tsyringe";
import { INotification } from "../interfaces";
import { NotificationType } from "../dto";

@injectable()
export default class NotificationService {
  async send(notification: INotification, body: NotificationType): Promise<void> {
    await notification.send(body);
  }
}
