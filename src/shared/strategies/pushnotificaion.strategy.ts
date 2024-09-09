import { injectable } from "tsyringe";
import { INotification } from "../interfaces";
import { AWSSNS } from "../facade";
import { PushNotificationInput } from "../dto";

@injectable()
export default class PushNotificationStrategy implements INotification {
  constructor(private awsSNS: AWSSNS) {}

  async send(args: PushNotificationInput): Promise<void> {
    await this.awsSNS.pushNotification(args);
  }
}
